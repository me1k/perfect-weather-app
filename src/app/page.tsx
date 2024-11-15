'use client';

import { useEffect, useState } from 'react';
import HourlyForecast from './HourlyForecast';

const POPULAR_CITIES = [
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
  { name: 'Munich', lat: 48.1351, lon: 11.582 },
  { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
  { name: 'Kiel', lat: 54.3213, lon: 10.1349 },
  { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821 },
];
const weatherCodeToIcon: { [key: number]: string } = {
  0: '01d',
  1: '02d',
  2: '03d',
  3: '04d',
  45: '50d',
  48: '50d',
  51: '09d',
  53: '09d',
  55: '09d',
  61: '10d',
  63: '10d',
  65: '10d',
  71: '13d',
  73: '13d',
  75: '13d',
  80: '09d',
  81: '09d',
  82: '09d',
  95: '11d',
  96: '11d',
  99: '11d',
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularCitiesWeather, setPopularCitiesWeather] = useState<
    { name: string; weatherCode: number; temperature: number }[]
  >([]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchPopularCitiesWeather = async () => {
    try {
      const promises = POPULAR_CITIES.map(
        async (city) =>
          await fetch('/api/currentWeather', {
            method: 'POST',
            body: JSON.stringify({ longitude: city.lon, latitude: city.lat }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Error fetching data for ${city.name}`);
            }
            return response.json();
          })
      );

      const results = await Promise.all(promises);

      const weatherData = results.map((res, i) => ({
        name: POPULAR_CITIES[i].name,
        temperature: Math.round(res.current.temperature2m),
        weatherCode: res.current.weatherCode,
      }));

      setPopularCitiesWeather(weatherData);
    } catch (error) {
      console.error("Error fetching popular cities' weather:", error);
    }
  };

  // Debounce functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        // searchCities(searchQuery);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchPopularCitiesWeather();
  }, []);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-blue-500 dark:bg-yellow-500 text-white dark:text-gray-800 rounded">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Popular Cities Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {popularCitiesWeather.map((city, index) => {
            const iconCode = weatherCodeToIcon[city.weatherCode] || '01d'; // Default to clear sky
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            return (
              <div
                key={index}
                className="pr-3 rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center gap-2">
                <img src={iconUrl} alt="Weather Icon" className="w-10 h-10" />
                <span>{city.name}</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-300">
                  {city.temperature}°C
                </span>
              </div>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by city or zip code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded"
          />
        </div>

        {/* Today Weather Section */}
        <section className="mb-6">
          {/* Hourly Weather Forecast */}
          <div className="flex flex-wrap gap-4 w-full">
            <HourlyForecast />
          </div>
        </section>

        {/* Weather Map */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Weather Map</h2>
          {/* Map implementation */}
        </section>

        {/* Forecast Tags */}
        <section>
          <div className="flex gap-4">
            {/* {['today', '7-day', '14-day'].map((type) => (
              <button
                key={type}
                onClick={() => setForecastType(type)}
                className={`px-4 py-2 rounded ${
                  forecastType === type
                    ? 'bg-blue-500 dark:bg-yellow-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                {type}
              </button>
            ))} */}
          </div>
          {/* <p className="mt-4">Current forecast type: {forecastType}</p> */}
        </section>
      </div>
    </div>
  );
}
