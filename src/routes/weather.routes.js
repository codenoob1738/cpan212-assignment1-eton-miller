import { Router } from 'express';
import { getCityWeather, getCacheStats } from '../lib/weather.js';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { HttpError } from '../lib/http-error.js';

export const weatherRouter = Router();

const weatherSource =
  'Weather data by Open-Meteo.com (https://open-meteo.com/)';

weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = parseCity(req.query.city);
    const data = await getCityWeather(city);

    res.status(200).json({
      data: data,
      weatherSource: weatherSource
    });
  } catch (err) {
    next(err);
  }
});

weatherRouter.get('/compare', async (req, res, next) => {
  try {
    const cities = parseCities(req.query.cities);

    const results = await Promise.allSettled(
      cities.map(city => getCityWeather(city))
    );

    const cityResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          city: cities[index],
          ok: true,
          weather: result.value
        };
      }

      const err = result.reason;
      let status = 500;
      let message = 'Internal server error';

      if (err instanceof HttpError) {
        status = err.status;
        message = err.message;
      }

      return {
        city: cities[index],
        ok: false,
        error: {
          status: status,
          message: message
        }
      };
    });

    const successful = cityResults.filter(city => city.ok);

    let warmest = null;
    let coldest = null;

    for (const city of successful) {
      if (warmest === null) {
        warmest = city;
      } else if (
        city.weather.current.temperatureC >
        warmest.weather.current.temperatureC
      ) {
        warmest = city;
      }

      if (coldest === null) {
        coldest = city;
      } else if (
        city.weather.current.temperatureC <
        coldest.weather.current.temperatureC
      ) {
        coldest = city;
      }
    }

    let warmestName = null;
    let coldestName = null;

    if (warmest !== null) {
      warmestName = warmest.weather.location.name;
    }

    if (coldest !== null) {
      coldestName = coldest.weather.location.name;
    }

    res.status(200).json({
      data: {
        cities: cityResults,
        summary: {
          succeeded: successful.length,
          failed: cityResults.length - successful.length,
          warmest: warmestName,
          coldest: coldestName
        }
      },
      weatherSource: weatherSource
    });
  } catch (err) {
    next(err);
  }
});

weatherRouter.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();

  res.status(200).json({
    data: stats
  });
});
