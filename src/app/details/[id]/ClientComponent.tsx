'use client';

import { weatherCodeToIcon } from '@/app/utils';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClientComponent = ({ weatherData, hourlyData, city }: any) => {
  const iconCode = weatherCodeToIcon[weatherData?.weatherCode] || '01d';
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className={`${!false ? 'dark' : ''}`}>
      <div className="flex gap-6 flex-col items-center p-8 max-w-6xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md min-h-screen">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {city?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Updated at: {new Date(weatherData?.current?.time).toLocaleString()}
          </p>
        </div>
        Weather Overview
        <div className="flex items-center gap-6 my-6">
          <Image
            src={iconUrl}
            alt="Weather Icon"
            className="w-20 h-20"
            width={100}
            height={100}
          />
          <div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">
              {Math.round(weatherData?.current?.temperature2m)}°C
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Apparent Temperature:{' '}
              {Math.round(weatherData?.current?.apparentTemperature)}
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
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
            <Image
              src={`http://openweathermap.org/img/wn/${
                weatherCodeToIcon[weatherData?.current?.weatherCode]
              }@2x.png`}
              alt="Weather Icon"
              className="w-10 h-10"
              width={100}
              height={100}
            />
            <p className="text-lg font-bold">
              {Math.round(weatherData?.current?.temperature2m)}°C
            </p>
            <div className="flex flex-col items-center">
              <p className="text-lg">
                {Math.round(weatherData?.current?.apparentTemperature)}°C
              </p>
              <p className="text-sm">Apparent Temperature</p>
            </div>
          </div>

          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hourlyData.map((hour: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-300 dark:bg-gray-600 p-4 rounded shadow w-full">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {new Date(hour.time).toLocaleTimeString()}
                </p>
                <Image
                  src={`http://openweathermap.org/img/wn/${hour.weatherCode}@2x.png`}
                  alt="Weather Icon"
                  className="w-10 h-10"
                  width={100}
                  height={100}
                />
                <p className="text-lg font-bold">
                  {Math.round(hour.temperature)}°C
                </p>
                <div className="flex flex-col items-center">
                  <p className="text-lg">
                    {Math.round(hour.apparentTemperature)}°C
                  </p>
                  <p className="text-sm">Apparent Temperature</p>
                </div>
              </div>
            ))
          }
        </div>
        {/* 16 Days Forecast */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full text-center text-gray-700 dark:text-gray-300">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Humidity</p>
            <p className="text-xl font-bold">
              {weatherData?.current?.relativeHumidity2m}%
            </p>
          </div>
        </div>
        {/* Weather Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full text-center text-gray-700 dark:text-gray-300">
          {/* Individual Parameter Cards */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Humidity</p>
            <p className="text-xl font-bold">
              {weatherData?.current?.relativeHumidity2m}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Precipitation</p>
            <p className="text-xl font-bold">
              {weatherData?.current?.precipitation} mm
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Rain</p>
            <p className="text-xl font-bold">{weatherData?.current?.rain} mm</p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Showers</p>
            <p className="text-xl font-bold">
              {weatherData?.current?.showers} mm
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Cloud Cover</p>
            <p className="text-xl font-bold">
              {weatherData?.current?.cloudCover}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Pressure (MSL)</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.current?.pressureMsl)} hPa
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Surface Pressure</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.current?.surfacePressure)} hPa
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Speed</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.current?.windSpeed10m)} km/h
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Direction</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.current?.windDirection10m)}°
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
            <p className="text-sm font-semibold">Wind Gusts</p>
            <p className="text-xl font-bold">
              {Math.round(weatherData?.current?.windGusts10m)} km/h
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
      );
    </div>
  );
};

export default ClientComponent;
