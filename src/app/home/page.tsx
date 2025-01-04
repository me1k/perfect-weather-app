import { POPULAR_CITIES } from '../utils';
import ClientComponent from './ClientComponent';

const fetchParams = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ],
  timezone: 'Europe/Berlin',
  forecast_days: 1,
  models: 'icon_seamless',
};

const fetchWeatherData = async ({
  lat,
  lon,
}: {
  name: string;
  lat: number;
  lon: number;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/currentWeather`, {
    method: 'POST',
    body: JSON.stringify({
      longitude: lon,
      latitude: lat,
      fetchParams,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    // Ensure fetch is made server-side by disabling caching
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
};

const Home = async () => {
  const promises = POPULAR_CITIES.map(async (city) => {
    const response = await fetchWeatherData(city);
    console.log({ response });
    return {
      name: city.name,
      temperature: response.current.temperature2m,
      apparentTemperature: response.current.apparentTemperature,
      weatherCode: response.current.weatherCode,
      lat: city.lat,
      lon: city.lon,
    };
  });

  const results = await Promise.all(promises);

  return <ClientComponent data={results} />;
};

export default Home;
