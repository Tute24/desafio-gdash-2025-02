from collector import fetch_info, format_resp
from sender import message_sender
import datetime
import time

def main():
    while True:
        now = datetime.datetime.now()
        resp = fetch_info()
        if resp is None:
            print("Could not fetch the data. Ending the process...")
            return
        formatted_resp = format_resp(resp)
        message_sender(formatted_resp)
        print(f"Data successfully fetched and sent to the queue as a message at {now}")
        time.sleep(600)


if __name__ == "__main__":
    main()  # ensures that the file only runs with the correct command
