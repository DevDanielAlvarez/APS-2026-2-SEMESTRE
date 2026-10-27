import type { Coordinates } from './location';

export type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  uvIndexMax: number;
  weatherCode: number;
  isDay: boolean;
  sunrise: string;
  sunset: string;
};

export async function fetchWeather(coords: Coordinates): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
    daily: 'sunrise,sunset,uv_index_max',
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar clima: ${response.status}`);
  }
  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    uvIndex: data.current.uv_index,
    uvIndexMax: data.daily.uv_index_max?.[0] ?? data.current.uv_index,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    sunrise: data.daily.sunrise?.[0],
    sunset: data.daily.sunset?.[0],
  };
}
