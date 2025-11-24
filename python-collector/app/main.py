from collector import fetch_info, format_resp
from sender import message_sender


def main():
    resp = fetch_info()
    if resp is None:
        print("Could not fetch the data. Ending the process...")
        return
    formatted_resp = format_resp(resp)
    message_sender(formatted_resp)


if __name__ == "__main__":
    main()  # ensures that the file only runs with the correct command
