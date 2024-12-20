import { POPULAR_CITIES } from '../utils';
import ClientComponent from './ClientComponent';

export const fetchparams = {
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


export const fetchWeatherData = async (city: {
  name?: string;
  lat: number | undefined;
  lon: number | undefined;
}) => {
  try {
    const response = await fetch('/api/currentWeather', {
      method: 'POST',
      body: JSON.stringify({
        longitude: city.lon,
        latitude: city.lat,
        fetchParams: fetchparams,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data for ${city.name}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching popular cities' weather:", error);
    return [];
  }
};

const Home = async () => {
  const promises = POPULAR_CITIES.map(async (city) => {
    const response = await fetchWeatherData(city);

    return {
      name: city.name,
      temperature: response.current.temperature2m,
      weatherCode: response.current.weatherCode,
      lat: city.lat,
      lon: city.lon,
    };
  });

  const results = await Promise.all(promises);

  return <ClientComponent data={results} />;
};

export default Home;
