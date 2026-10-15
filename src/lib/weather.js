import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { buildCache } from './cache.js';

const cache = buildCache(config.cacheTtlSeconds);

export async function getCityWeather(city) {
  const key = city.trim().toLowerCase();

  const cachedWeather = cache.get(key)

  if (cachedWeather !== undefined) {
    return {
      location: cachedWeather.location,
      current: cachedWeather.current,
      daily: cachedWeather.daily,
      fetchedAt: cachedWeather.fetchedAt,
      cached: true
    };
  }

  const location = await geocodeCity(city);

  const forecast = await getForecast(
    location.latitude, 
    location.longitude
  );

  const current = forecast.current;
  const daily = forecast.daily;

  const weather = {
    location: location,

    current: {
      time: current.time,
      temperatureC: current.temperature_2m,
      feelsLikeC: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeedKmh: current.wind_speed_10m,
      weatherCode: current.weather_code,
      condition: describeWeatherCode(current.weather_code),
    },

    daily: daily.time.map((date, index) => ({
      date: date,
      temperatureMinC: daily.temperature_2m_min[index],
      temperatureMaxC: daily.temperature_2m_max[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      weatherCode: daily.weather_code[index],
      condition: describeWeatherCode(daily.weather_code[index]),
    })),

    fetchedAt: new Date().toISOString(),
    cached: false
  };

  cache.set(key, weather);

  return weather;
}

export function getCacheStats() {
  return cache.details();
}
