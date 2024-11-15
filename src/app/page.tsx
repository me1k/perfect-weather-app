'use client';

import { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import LocationWeatherCard from './LocationWeatherCard';

const POPULAR_CITIES = [
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
  { name: 'Munich', lat: 48.1351, lon: 11.582 },
  { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
  { name: 'Kiel', lat: 54.3213, lon: 10.1349 },
  { name: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821 },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [suggestions, setSuggestions] = useState<any[]>([]);
  const [popularCitiesWeather, setPopularCitiesWeather] = useState<
    { name: string; weatherCode: number; temperature: number }[]
  >([]);
  const [darkMode, setDarkMode] = useState(false);

  const fetchPopularCitiesWeather = async () => {
    try {
      const promises = POPULAR_CITIES.map((city) =>
        fetch('/api/currentWeather', {
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
            {false ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by city or zip code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded"
          />
          {/* {suggestions.length > 0 && (
            <ul className="bg-white dark:bg-gray-700 mt-2 p-3 rounded shadow">
              {suggestions.map((city, index) => (
                <li key={index} className="p-2">
                  {city.display_name}
                </li>
              ))}
            </ul>
          )} */}
        </div>

        {/* Popular Cities */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Popular Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCitiesWeather.map((city, index) => (
              <WeatherCard
                weatherCode={city.weatherCode}
                cityName={city.name}
                temperature={city.temperature}
                key={index}
              />
            ))}
            <LocationWeatherCard />
          </div>
        </section>

        {/* Weather Map */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Weather Map</h2>
          {/* <MapContainer center={[51.1657, 10.4515]} zoom={6} className="h-80">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[52.52, 13.405]}>
              <Popup>Berlin: Simulated 15-min forecast</Popup>
            </Marker>
          </MapContainer> */}
        </section>

        {/* Forecast Tags */}
        <section>
          <div className="flex gap-4">
            {['today', '7-day', '14-day'].map((type) => (
              <button
                key={type}
                //onClick={() => setForecastType(type)}
                className={`px-4 py-2 rounded ${
                  false
                    ? 'bg-blue-500 dark:bg-yellow-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                {type}
              </button>
            ))}
          </div>
          <p className="mt-4">Current forecast type: {'forecastType'}</p>
        </section>
      </div>
    </div>
  );
}
