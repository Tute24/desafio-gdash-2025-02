from collector import fetch_info, format_resp
import json


def main():
    raw_data = fetch_info()
    formatted_data = format_resp(raw_data)
    print(json.dumps(formatted_data, indent=4, ensure_ascii=False))


if __name__ == "__main__":
    main() #ensures that the file only runs with the correct command
