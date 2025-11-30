package types

type WeatherPayload struct {
	Weather WeatherData `json:"weather"`
}

type WeatherData struct {
	Current CurrentWeather   `json:"current"`
	Daily   []DailyForecast  `json:"daily"`
	Geo     GeoInfo          `json:"geo"`
}

type CurrentWeather struct {
	Dt          string   `json:"dt"`
	Temp        *float64 `json:"temp"`
	FeelsLike   *float64 `json:"feels_like"`
	Humidity    *float64 `json:"humidity"`
	WindSpeed   *float64 `json:"wind_speed"`
	MainWeather *string  `json:"main_weather_status"`
	Description *string  `json:"description"`
}

type DailyForecast struct {
	Dt          string   `json:"dt"`
	Summary     string   `json:"summary"`
	Max         *float64 `json:"max"`
	Min         *float64 `json:"min"`
	Humidity    *float64 `json:"humidity"`
	WindSpeed   *float64 `json:"wind_speed"`
	Rain        *float64 `json:"rain"`
	Pop         *float64 `json:"pop"`
	Main        *string  `json:"main"`
	Description *string  `json:"description"`
}

type GeoInfo struct {
	Name    string `json:"name"`
	Country string `json:"country"`
	State   string `json:"state"`
}
