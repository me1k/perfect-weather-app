import { POPULAR_CITIES, weatherCodeToIcon } from '@/app/utils';
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

const hourlyParams = {
  hourly: [
    'temperature_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
  ],
  timezone: 'Europe/Berlin',
  forecast_hours: 6,
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
  const data = await response.json();

  return data;
};

const fetchHourlyForecast = async ({
  lat,
  lon,
}: {
  name: string;
  lat: number;
  lon: number;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/hourlyWeather`, {
      method: 'POST',
      body: JSON.stringify({
        longitude: lon,
        latitude: lat,
        fetchParams: hourlyParams,
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

    const data = await response.json();
    const hourlyData = data?.hourly;
    const now = new Date();
    const nextSixHours = hourlyData.time
      .map((time: string, index: number) => ({
        time: new Date(time),
        temperature: hourlyData.temperature2m[index],
        weatherCode: weatherCodeToIcon[hourlyData.weatherCode[index]] || '01d',
        apparentTemperature: hourlyData.apparentTemperature[index],
      }))
      .filter(
        (entry: { time: Date }) =>
          entry.time > now &&
          entry.time <= new Date(now.getTime() + 6 * 60 * 60 * 1000)
      ) // Filter next 6 hours
      .map((entry: { time: Date }) => ({
        ...entry,
        time: entry.time,
      }));

    return nextSixHours;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
};

const WeatherDetailPage = async ({ params }: { params: { id: string } }) => {
  const pageParams = await params;
  const city = POPULAR_CITIES.find((city) => city.name === pageParams.id);

  if (!city) return;

  const hourlyData = await fetchHourlyForecast(city);
  const weatherData = await fetchWeatherData(city);
  
  return <ClientComponent weatherData={weatherData} hourlyData={hourlyData} city={city}/>;
};

export default WeatherDetailPage;
