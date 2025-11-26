import os
import time
import requests
import json
import pika
import datetime
import logging
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
LAT = os.getenv("OPENWEATHER_API_LAT")
LON = os.getenv("OPENWEATHER_API_LON")
RABBIT_MQ_PORT = int(os.getenv("RABBIT_MQ_PORT", 5672))
RABBIT_MQ_HOST = os.getenv("RABBIT_MQ_HOST", "localhost")
RABBIT_MQ_QUEUE = os.getenv("RABBIT_MQ_QUEUE", "data_queue")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)  # this lib is more appropriated for seeing logs on docker than just using print, and I elected to use it because I couldn't see the logs even if the app was running ok


def dt_parse(dt_timestamp, timezone_offset):
    dt_utc = datetime.datetime.fromtimestamp(dt_timestamp, tz=datetime.timezone.utc)
    dt_local = dt_utc + datetime.timedelta(seconds=timezone_offset)
    return dt_local  # made this function to convert the date from the weather API to normal date


def fetch_info():
    weather_url = f"https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&exclude=minutely&units=metric&appid={API_KEY}"
    try:
        weather_resp = requests.get(weather_url, timeout=10)
        weather_resp.raise_for_status()
        resp = {"weather": weather_resp.json()}
        return resp
    except requests.exceptions.RequestException:
        logging.error("Error when trying to fetch weather data.", exc_info=True)
        return None  # retrieves the data from the openweather API and returns None if it fails


##The following function works as a data organizer
def format_resp(resp_json):
    main = resp_json.get("weather", {})
    current = main.get("current", {})
    current_dt = current.get("dt", 0)
    timezone_offset = main.get("timezone_offset", 0)
    current_weather = current.get("weather", [])
    daily_list = main.get("daily", [])
    daily_payload = []
    hourly_list = main.get("hourly", [])
    hourly_payload = []

    for day in daily_list:
        weather_info = day.get("weather", [{}])
        daily_payload.append(
            {
                "dt": dt_parse(day.get("dt", 0), timezone_offset).strftime("%d-%m-%Y"),
                "summary": day.get("summary", ""),
                "max": day.get("temp", {}).get("max", None),
                "min": day.get("temp", {}).get("min", None),
                "humidity": day.get("humidity", None),
                "wind_speed": day.get("wind_speed", None),
                "rain": day.get("rain", 0),
                "pop": day.get("pop", 0),
                "main": weather_info[0].get("main", "") if weather_info else "",
                "description": weather_info[0].get("description", "")
                if weather_info
                else "",
            }
        )

    for hour in hourly_list:
        weather_info = hour.get("weather", [{}])
        hourly_payload.append(
            {
                "dt": dt_parse(hour.get("dt", 0), timezone_offset).strftime(
                    "%d-%m-%Y %H:%M:%S"
                ),
                "temp": hour.get("temp", None),
                "humidity": hour.get("humidity", None),
                "wind_speed": hour.get("wind_speed", None),
                "pop": hour.get("pop", 0),
                "main": weather_info[0].get("main", None) if weather_info else None,
                "description": weather_info[0].get("description", None)
                if weather_info
                else None,
            }
        )

    payload = {
        "weather": {
            "current": {
                "dt": dt_parse(current_dt, timezone_offset).strftime(
                    "%d-%m-%Y %H:%M:%S"
                ),
                "temp": current.get("temp", None),
                "feels_like": current.get("feels_like", None),
                "humidity": current.get("humidity", None),
                "wind_speed": current.get("wind_speed", None),
                "main_weather_status": current_weather[0].get("main", None),
                "description": current_weather[0].get("description", None),
            },
            "daily": daily_payload,
            "hourly": hourly_payload,
            "geo": {
                "name": "Belo Horizonte",
                "country": "BR",
                "state": "Minas Gerais",
            },
        }
    }
    return payload


# the message publisher that connects with RabbitMQ
def message_sender(payload: dict):
    connection = None
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBIT_MQ_HOST, port=RABBIT_MQ_PORT)
        )
        channel = connection.channel()
        channel.queue_declare(queue=RABBIT_MQ_QUEUE, durable=True)
        channel.basic_publish(
            exchange="",
            routing_key=RABBIT_MQ_QUEUE,
            body=json.dumps(payload),
            properties=pika.BasicProperties(delivery_mode=2),
        )
        logging.info(f"Message successfully sent to {RABBIT_MQ_QUEUE}.")
    except Exception:
        logging.error("An error occured when sending the message.", exc_info=True)
    finally:
        try:
            if connection and connection.is_open:
                connection.close()
        except Exception:
            logging.error(
                "Error at the end of the process when closing the connection.",
                exc_info=True,
            )


# The whole process (Fetching weather data at openweather -> organizing the retrieved data -> sending the data via message to RabbitMQ occurs every 60 minutes)
def main():
    logging.info("Starting to send the collected data...")
    while True:
        try:
            now = datetime.datetime.now()
            resp = fetch_info()
            if resp is None:
                logging.info(
                    "Could not fetch the most recente data. Retrying in 1 hour..."
                )
                time.sleep(3600)
                continue
            data_to_send = format_resp(resp)
            logging.info("Data alredy fetched and ready to be sent!")
            message_sender(data_to_send)
            logging.info(
                f"Data sent to Queue at {now}. The next data will be sent in 1 hour."
            )
        except Exception:
            logging.error("There was an error:", exc_info=True)

        time.sleep(3600)


if __name__ == "__main__":
    main()  # ensures that the file only runs with the correct command
