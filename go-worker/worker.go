package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"worker/types"

	"github.com/rabbitmq/amqp091-go"
)

const (
	maxRetries int = 5
)

func connectWithRetry(url string) *amqp091.Connection {
	var connection *amqp091.Connection
	var err error
	for attempt := 1; attempt <= maxRetries; attempt++ {
		connection, err = amqp091.Dial(url)
		if err == nil {
			log.Print("RabbitMQ was succesfully connected!")
			return connection
		}
		log.Printf("There was an error when trying to connect with RabbitMQ (%d of %d attempts): %v", attempt, maxRetries, err)

		time.Sleep(3 * time.Second)
		// If there's an error, it will wait 3 seconds to try to connect again
	}
	// it will retry to connect 5 times if there's an error

	log.Fatal("The application wasn't able to connect to RabbitMQ")
	return nil
}

func processMessage(message amqp091.Delivery) {
	var weatherData types.WeatherPayload

	err := json.Unmarshal(message.Body, &weatherData)
	if err != nil {
		log.Printf("There was an error parsing the message from the queue: %v", err)
	}

	log.Printf("New weather data for %s was received", weatherData.Weather.Geo.Name)

	err = postData(weatherData)
	if err != nil {
		log.Printf("Weather data couldn't be sent to the backend")
		err = message.Nack(false, true)
		if err != nil {
			log.Printf("Nack failed:%v", err)
			return
		}
		return
		// requeing because the message is valid, it just couldn't be sent to the backend
	}
	err = message.Ack(false)
	// final step
	if err != nil {
		log.Printf("Ack failed:%v", err)
		return
	}
	log.Printf("New weather data for %s, collected at %s was sent to the backend and processed successfully.\nData: %+v\n", weatherData.Weather.Geo.Name, weatherData.Weather.Current.Dt, weatherData)
}

func postData(data types.WeatherPayload) error {
	apiHost := os.Getenv("API_HOST")
	apiPort := string(os.Getenv("API_PORT"))
	url := fmt.Sprintf("http://%s:%s/weather/register", apiHost, apiPort)

	jsonBody, err := json.Marshal(data)
	if err != nil {
		log.Fatalf("error serializing payload: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Fatalf("error creating POST request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("error making POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		responseBody, _ := io.ReadAll(resp.Body)
		log.Fatalf("backend returned status %d: %s", resp.StatusCode, string(responseBody))
	}

	log.Printf("Weather data successfully sent to backend: %s", resp.Status)
	return nil
}

func main() {
	log.Println("Starting worker...")

	rabbitmqHost := os.Getenv("RABBIT_MQ_HOST")
	rabbitmqPort := os.Getenv("RABBIT_MQ_PORT")
	rabbitmqQueue := os.Getenv("RABBIT_MQ_QUEUE")

	if rabbitmqHost == "" {
		rabbitmqHost = "rabbitmq"
	}

	if rabbitmqPort == "" {
		rabbitmqPort = "5672"
	}

	if rabbitmqQueue == "" {
		rabbitmqQueue = "data_queue"
	}

	url := fmt.Sprintf("amqp://guest:guest@%s:%s/", rabbitmqHost, rabbitmqPort)

	connection := connectWithRetry(url)
	defer connection.Close()

	channel, err := connection.Channel()
	if err != nil {
		log.Fatalf("There was an error when opening the connection Channel: %v", err)
	}
	defer channel.Close()

	_, err = channel.QueueDeclare(rabbitmqQueue, true, false, false, false, nil)
	if err != nil {
		log.Fatalf("There was an error when declaring the queue: %v", err)
	}

	messages, err := channel.Consume(rabbitmqQueue, "", false, false, false, false, nil)
	if err != nil {
		log.Fatalf("There was an error when consuming the data: %v", err)
	}

	forever := make(chan bool)

	log.Println("Waiting for messages from the queue...")

	go func() {
		for message := range messages {
			processMessage(message)
		}
	}()
	// like an async function that runs in parallel with the rest of the process

	<-forever
	// keeping the process (main) alive
}
