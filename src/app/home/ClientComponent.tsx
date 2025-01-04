'use client';

import { useState } from 'react';

import Image from 'next/image';
import { weatherCodeToIcon } from '../utils';

import { useRouter } from 'next/navigation';

interface WeatherData {
  name: string;
  temperature: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weatherCode: any;
}

interface ClientComponentProps {
  data: WeatherData[];
}

const ClientComponent: React.FC<ClientComponentProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode] = useState(false);
  const { push } = useRouter();

  return (
    <div className={`${!darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold center">Weather App</h1>
        </header>

        {/* Popular Cities Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {data.length > 0
            ? data.map((city, index) => {
                const iconCode = weatherCodeToIcon[city.weatherCode] || '01d';
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

                return (
                  <div
                    onClick={() => push(`/details/${city.name}`)}
                    key={index}
                    className="cursor-pointer pr-3 rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 flex items-center gap-2">
                    <Image
                      src={iconUrl}
                      alt="Weather Icon"
                      className="w-10 h-10"
                      width={100}
                      height={100}
                    />
                    <span>{city.name}</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-300">
                      {Math.round(city.temperature)}°C
                    </span>
                  </div>
                );
              })
            : 'Loading...'}
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
};

export default ClientComponent;
