import pika
import os
import dotenv
import json

dotenv.load_dotenv()

RABBIT_MQ_PORT = int(os.getenv("RABBIT_MQ_PORT", 5672))
RABBIT_MQ_HOST = os.getenv("RABBIT_MQ_HOST", "localhost")
RABBIT_MQ_QUEUE = os.getenv("RABBIT_MQ_QUEUE", "data_queue")

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
        print(f"Message successfully sent to {RABBIT_MQ_QUEUE}.")
    except Exception as err:
        print("An error occured when sending the message.", err)
    finally:
        try:
            if connection and connection.is_open:
                connection.close()
        except Exception as err:
            print("Error at the end of the process when closing the connection.", err)
