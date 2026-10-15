import { HttpError } from '../lib/http-error.js';

export function parseCity(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, "Invalid query", {
      city: "City can only be provided once"
    });
  }

  const city = value.trim();

  if (city.length < 2) {
    throw new HttpError(400, "Invalid query", {
      city: "City must be 2 to 60 characters"
    });
  }

  if (city.length > 60) {
    throw new HttpError(400, "Invalid query", {
      city: "City must be 2 to 60 characters"
    });
  }

  return city;

}

export function parseCities(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, "Invalid query", {
      cities: "City can only be provided once"
    });
  }

  const cities = value.split(',').map(city => city.trim());

  if (cities.length < 2 || cities.length > 5) {
    throw new HttpError(400, 'Invalid query', {
      cities: 'provide between 2 and 5 cities'
    });
  }

  for (const city of cities) {
    if (city.length < 2) {
      throw new HttpError(400, 'Invalid query', {
        cities: 'each city must be 2 to 60 characters'
      });
    }

    if (city.length > 60) {
      throw new HttpError(400, 'Invalid query', {
        cities: 'each city must be 2 to 60 characters'
      });
    }
  }

  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      if (cities[i].toLowerCase() === cities[j].toLowerCase()) {
        throw new HttpError(400, 'Invalid query', {
          cities: `"${cities[j]}" is listed more than once`
        });
      }
    }
  }

  return cities;
}