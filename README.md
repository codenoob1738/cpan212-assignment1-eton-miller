# City Weather API

This assignment uses an Express API to get the weather forecasr for different cities from the Open-Meteo database.

## Run it

1. Install Node.js (if not already installed)
2. Install project dependencies
3. Run the command cp .env.example .env to copy the example file
4. Run the command npm run dev to start the server

## Environment variables

| Variable| Default | Description |
-----------------------------------------------------------------------------------------------------------------------------
| PORT | 4000 | Sets the port used by the server. |
| GEOCODING_URL | https://geocoding-api.open-meteo.com/v1 | Sets the URL used to find a city's coordinates. |
| FORECAST_URL | https://api.open-meteo.com/v1 | Sets the URL used to get weather forecasts. |
| UPSTREAM_TIMEOUT_MS | 5000 | Sets how long the application waits for an API request before timing out, in milliseconds. |
| CACHE_TTL_SECONDS | 600 | Sets how long cached weather data stays valid, in seconds. |

## Endpoints

1. Get weather for a city
GET /api/weather?city=Toronto, gets the city's current weather, location, three-day forecast, when the data was fetched

2. Compare multiple cities
GET /api/compare?cities=Mexico City,Vancouver,New York, gets the weather for each city and shows how many requests succeeded or failed. It also shows which city is the warmest and coldest. If one city fails, the other results are still returned.

3. Get cache stats
GET /api/cache/stats, shows how many cache entries are active, how many times the cache was used or missed, and how long the data stays in the cache.

4. Unknown routes
GET /api/unknown, shows a 404 error when the requested route does not exist.


## Data source

Open-Meteo: https://open-meteo.com/en/docs/gfs-api

## AI use

ChatGpt was used for troubleshooting, debugging code and wrote a section of code in weather.routes.js (lines 25 - 40)
