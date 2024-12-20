import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';

const params = {
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'rain',
    'weather_code',
    'cloud_cover',
  ],
  forecast_days: 16,
  timezone: 'Europe/Berlin',
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, {
      ...params,
      longitude: body.longitude,
      latitude: body.latitude,
    });
    const response = responses[0];

    const hourly = response.hourly();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const weatherData = {
      hourly: {
        temperature2m: hourly?.variables(0)!.valuesArray(),
        relativeHumidity2m: hourly?.variables(1)!.valuesArray(),
        apparentTemperature: hourly?.variables(2)!.valuesArray(),
        rain: hourly?.variables(3)!.valuesArray(),
        weatherCode: hourly?.variables(4)!.valuesArray(),
        cloudCover: hourly?.variables(5)!.valuesArray(),
        latitude,
        longitude,
      },
    };
    return NextResponse.json(weatherData);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
