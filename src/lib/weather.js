import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { buildCache } from './cache.js';

const cache = buildCache(config.cacheTtlSeconds);

export async function getCityWeather(city) {
  const location = await geocodeCity(city);

  const forecast = await getForecast(
    location.latitude, 
    location.longitude
  );

  const current = forecast.current;
  const daily = forecast.daily;

  return {
    location: location,

    current: {
      time: current.time,
      temperatureC: current.temperature_2m,
      feelsLikeC: current.apparent_temperature,
      humidity: current.relativehumidity_2m,
      windSpeedKmh: current.windspeed_10m,
      weatherCode: current.weathercode,
      condition: describeWeatherCode(current.weathercode),
    },

    daily: daily.time.map((date, index) => ({
      date: date,
      temperatureMinC: daily.temperature_2m_min[index],
      temperatureMaxC: daily.temperature_2m_max[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      weatherCode: daily.weathercode[index],
      condition: describeWeatherCode(daily.weathercode[index]),
    })),

    fetchedAt: new Date().toISOString(),
    cached: false
  };
}

export function getCacheStats() {
  return cache.details();
}
