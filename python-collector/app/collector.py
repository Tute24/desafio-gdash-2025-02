import os
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
LAT = os.getenv("OPENWEATHER_API_LAT")
LON = os.getenv("OPENWEATHER_API_LON")


def dt_parse(dt_timestamp, timezone_offset):
    dt_utc = datetime.fromtimestamp(dt_timestamp, tz=timezone.utc)
    dt_local = dt_utc + timedelta(seconds=timezone_offset)
    return dt_local


def fetch_info():
    weather_url = f"https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&exclude=minutely&units=metric&appid={API_KEY}"
    geo_url = f"http://api.openweathermap.org/geo/1.0/reverse?lat={LAT}&lon={LON}&limit=2&appid={API_KEY}"
    try:
        weather_resp = requests.get(weather_url, timeout=10)
        geo_resp = requests.get(geo_url, timeout=10)
        weather_resp.raise_for_status()
        geo_resp.raise_for_status()
        resp = {"weather": weather_resp.json(), "geo": geo_resp.json()}
        return resp
    except requests.exceptions.RequestException as err:
        print("Error when trying to fetch weather data.", err)
        return None


def format_resp(resp_json):
    main = resp_json.get("weather", {})
    geo = resp_json.get("geo", [{}])
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
            "alerts": main.get("alerts", [{}]),
            "geo": {
                "name": geo[0].get("name", None),
                "country": geo[0].get("country", None),
                "state": geo[0].get("state", None),
            },
        }
    }
    return payload
