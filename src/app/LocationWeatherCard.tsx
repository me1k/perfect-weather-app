import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface UserWeather {
  city: string;
  temperature2m: number;
  weatherCode: number;
}

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

const LocationWeatherCard: React.FC = () => {
  const [userWeather, setUserWeather] = useState<UserWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  const fetchUserLocationWeather = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      console.log('error');
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log({ position });
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        setError('Unable to retrieve your location.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const res = async () => {
      try {
        const weatherResponse = await fetch('/api/currentWeather', {
          method: 'POST',
          body: JSON.stringify({
            longitude: location.longitude,
            latitude: location.latitude,
          }),
        });
        const weatherData = await weatherResponse.json();

        // Fetch city name using reverse geocoding
        const cityResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
        );

        if (!cityResponse) throw new Error('failed to fetch city name');

        const cityData = await cityResponse.json();
        const cityName = cityData.address.city || 'Your Location';
        const weather = weatherData.current;
        console.log({ weather });

        setUserWeather({
          city: cityName,
          temperature2m: Math.round(weather.temperature2m),
          weatherCode: weather.weatherCode,
        });
      } catch (error: unknown) {
        setError(`${error}, Failed to fetch weather data.`);
      } finally {
        setLoading(false);
      }
    };
    if (location.latitude > 0) {
      res();
    }
  }, [location]);

  return (
    <div
      className="bg-white dark:bg-gray-700 shadow rounded p-4 text-center cursor-pointer"
      onClick={fetchUserLocationWeather}>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !userWeather && (
        <p className="text-gray-500">Click to get your location weather</p>
      )}
      {userWeather && (
        <>
          <h3 className="font-semibold mb-2">{userWeather.city}</h3>
          <Image
            src={`http://openweathermap.org/img/wn/${
              weatherCodeToIcon[userWeather.weatherCode]
            }@2x.png`}
            alt="Weather Icon"
            className="mx-auto"
            width={100}
            height={100}
          />
          <p className="text-lg">{userWeather.temperature2m}°C</p>
        </>
      )}
    </div>
  );
};

export default LocationWeatherCard;
