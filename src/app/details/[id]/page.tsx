'use client';
import { fetchWeatherData } from '@/app/home/page';
import { POPULAR_CITIES, weatherCodeToIcon } from '@/app/utils';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const WeatherDetailPage = () => {
  const { id } = useParams();
  const [weatherData, setWeatherData] = useState<any>();
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconCode = weatherCodeToIcon[weatherData?.weatherCode] || '01d';
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const city = POPULAR_CITIES.find((city) => city.name === id);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWeatherData({
        lat: city?.lat,
        lon: city?.lon,
      });
      setWeatherData(data.current);
      console.log({ data });
    };
    getData();
  }, [id, city]);

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city?.lat}&longitude=${city?.lon}&hourly=temperature_2m,weathercode&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        const hourlyData = data.hourly;

        const now = new Date();
        const nextSixHours = hourlyData.time
          .map((time: string, index: number) => ({
            time: new Date(time),
            temperature: hourlyData.temperature_2m[index],
            icon: weatherCodeToIcon[hourlyData.weathercode[index]] || '01d',
          }))
          .filter(
            (entry: { time: Date }) =>
              entry.time > now &&
              entry.time <= new Date(now.getTime() + 6 * 60 * 60 * 1000)
          ) // Filter next 6 hours
          .map((entry: { time: Date }) => ({
            ...entry,
            time: entry.time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));

        setHourlyForecast(nextSixHours);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetch16DayForecast = async () => {
      try {
        const response = await fetch('/api/weather-16-days', {
          method: 'POST',
          body: JSON.stringify({ longitude: city?.lon, latitude: city?.lat }),
        });
        const data = await response.json();
        console.log({ data });

        const weatherCodes = Object.values<string>(data.hourly.weatherCode).map(
          (weatherCode) => weatherCode
        );
       
      } catch (err) {
        console.log({ err });
      }
    };
    fetch16DayForecast();
    fetchHourlyForecast();
  }, [city?.lat, city?.lon]);

  if (loading) {
    return <p>Loading hourly forecast...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className={`${!false ? 'dark' : ''}`}>
      <div className="flex gap-6 flex-col items-center p-8 max-w-6xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-screen">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Weather in {city?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Updated at:{' '}
            {weatherData?.time.toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Weather Overview */}
        <div className="flex items-center gap-6 my-6">
          <img src={iconUrl} alt="Weather Icon" className="w-20 h-20" />
          <div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">
              {Math.round(weatherData?.temperature2m)}°C
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Apparent Temperature:{' '}
              {Math.round(weatherData?.apparentTemperature)}
              °C
            </p>
            <p
              className={`text-sm font-medium ${
                weatherData?.isDay ? 'text-yellow-500' : 'text-blue-500'
              }`}>
              {weatherData?.isDay ? 'Daytime' : 'Nighttime'}
            </p>
          </div>
        </div>

        {/* 6 Hour Weather Forecast */}

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          6 Hour Forecast
        </h1>
        {/* Hourly Weather Forecast */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 rounded shadow w-full">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Now
            </p>
            <Image
              src={`http://openweathermap.org/img/wn/${
                weatherCodeToIcon[weatherData?.weatherCode]
              }@2x.png`}
              alt="Weather Icon"
              className="w-10 h-10"
              width={100}
              height={100}
            />
            <p className="text-lg font-bold">
              {Math.round(weatherData?.temperature2m)}°C
            </p>
          </div>
          {hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 rounded shadow w-full">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {hour.time}
              </p>
              <Image
                src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                alt="Weather Icon"
                className="w-10 h-10"
                width={100}
                height={100}
              />
              <p className="text-lg font-bold">{hour.temperature}°C</p>
            </div>
          ))}
        </div>
        {/* 16 Days Forecast */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full text-center text-gray-700 dark:text-gray-300">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Humidity</p>
            <p className="text-xl font-bold">
              {weatherData?.relativeHumidity2m}%
            </p>
          </div>
        </div>
        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full text-center text-gray-700 dark:text-gray-300">
          {/* Individual Parameter Cards */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Humidity</p>
            <p className="text-xl font-bold">
              {weatherData?.relativeHumidity2m}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Precipitation</p>
            <p className="text-xl font-bold">{weatherData?.precipitation} mm</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Rain</p>
            <p className="text-xl font-bold">{weatherData?.rain} mm</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Showers</p>
            <p className="text-xl font-bold">{weatherData?.showers} mm</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Cloud Cover</p>
            <p className="text-xl font-bold">{weatherData?.cloudCover}%</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Pressure (MSL)</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.pressureMsl)} hPa
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Surface Pressure</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.surfacePressure)} hPa
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Speed</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.windSpeed10m)} km/h
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Direction</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.windDirection10m)}°
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Gusts</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.windGusts10m)} km/h
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WeatherDetailPage;
