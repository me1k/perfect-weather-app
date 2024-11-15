import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const POPULAR_CITIES = [
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
  { name: 'Munich', lat: 48.1351, lon: 11.582 },
  { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
  { name: 'Kiel', lat: 54.3213, lon: 10.1349 },
  { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821 },
];

const weatherCodeToIcon: { [key: number]: string } = {
  0: '01d', // Clear sky
  1: '02d', // Mainly clear
  2: '03d', // Partly cloudy
  3: '04d', // Overcast
  45: '50d', // Fog
  48: '50d', // Depositing rime fog
  51: '09d', // Drizzle: Light intensity
  61: '10d', // Rain: Slight
  80: '09d', // Rain showers: Slight
  95: '11d', // Thunderstorm: Moderate
};

const HourlyForecast = () => {
  const [hourlyForecast, setHourlyForecast] = useState<
    { time: string; temperature: number; icon: string }[]
  >([]);
  const [weatherData, setCurrentWeatherData] = useState<{
    weatherCode: number;
    temperature2m: number;
  }>({ temperature2m: 0, weatherCode: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const city =
    POPULAR_CITIES[Math.floor(Math.random() * POPULAR_CITIES.length)];

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m,weathercode&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        const hourlyData = data.hourly;
        console.log({ hourlyData });
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

    const fetchCurrentWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/currentWeather', {
          method: 'POST',
          body: JSON.stringify({ longitude: city.lon, latitude: city.lat }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        const weatherData = data;
        console.log({ weatherData });
        setCurrentWeatherData(weatherData.current);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyForecast();
    fetchCurrentWeather();
  }, []);

  if (loading) {
    return <p>Loading hourly forecast...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Das Wetter in {city.name}
      </h2>

      {/* Hourly Weather Forecast */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 rounded shadow w-full">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Jetzt
          </p>
          <Image
            src={`http://openweathermap.org/img/wn/${
              weatherCodeToIcon[weatherData?.weatherCode]
            }@2x.png`}
            alt="Weather Icon"
            className="w-10 h-10"
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
            />
            <p className="text-lg font-bold">{hour.temperature}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
