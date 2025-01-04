'use client';

import { useState } from 'react';

import Image from 'next/image';
import { weatherCodeToIcon } from '../utils';

import { useRouter } from 'next/navigation';

interface WeatherData {
  name: string;
  temperature: number;
  apparentTemperature: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weatherCode: any;
}

interface ClientComponentProps {
  data: WeatherData[];
}

const ClientComponent: React.FC<ClientComponentProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { push } = useRouter();

  return (
    <div className={`${!false ? 'dark' : ''}`}>
      <div className="flex gap-6 flex-col items-center p-8 max-w-6xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-screen">
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

        {/* Current Weather */}
        <section className="mb-6 w-full space-y-4">
          <h2 className="text-xl font-semibold mb-4">Berlin</h2>
          {data.map((c, i) => {
            if (c.name !== 'Berlin') return null;
            return (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 rounded shadow w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>

                <Image
                  src={`http://openweathermap.org/img/wn/${
                    weatherCodeToIcon[c?.weatherCode]
                  }@2x.png`}
                  alt="Weather Icon"
                  className="w-10 h-10"
                  width={100}
                  height={100}
                />
                <p className="text-lg font-bold">
                  {Math.round(c?.temperature)}°C
                </p>
                <div className="flex flex-col items-center">
                  <p className="text-lg">
                    {Math.round(c?.apparentTemperature)}°C
                  </p>
                  <p className="text-sm">Apparent Temperature</p>
                </div>
              </div>
            );
          })}
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
};

export default ClientComponent;
