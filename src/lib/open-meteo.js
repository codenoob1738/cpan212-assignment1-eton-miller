import { config } from '../config.js';
import { HttpError } from './http-error.js';

async function fetchJson(url, apiName) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(config.upstreamTimeoutMs),
    });
    if (!response.ok) {
      throw new HttpError(502, `Did not get a successful response from the ${apiName} API`);
    }
    return await response.json();
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    if (err.name === 'TimeoutError') {
      throw new HttpError(504, `Timeout while fetching from the ${apiName} API`);
    }
    if (err instanceof SyntaxError) {
      throw new HttpError(502, `Invalid JSON from the ${apiName} API`);
    }
    throw new HttpError(502, `Error while fetching from the ${apiName} API`);
  }
}

export async function geocodeCity(name) {
  const url = new URL(`${config.geocodingUrl}/search`);

  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const data = await fetchJson(url, 'geocoding');

  if (!data.results) {
    throw new HttpError(404, `City not found: ${name}`);
  }

  if (data.results.length === 0) {
    throw new HttpError(404, `City not found: ${name}`);
  }

  const city = data.results[0];

  return {
    name: city.name,
    region: city.admin1,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
  };
}

export async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    timezone: 'auto',
  });

  const url = new URL(`${config.forecastUrl}/forecast?${params}`);

  return await fetchJson(url, 'forecast');
}
