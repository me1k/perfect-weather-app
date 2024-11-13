import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const params = {
      latitude: 52.520007,
      longitude: 13.404954,
      current: [
        'temperature_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
      ],
      forecast_days: 1,
      models: 'icon_seamless',
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];
    const current = response.current();
    const latitude = response.latitude();
    const longitude = response.longitude();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date(Number(current?.time()) * 1000),
        temperature2m: current?.variables(0)!.value(),
        apparentTemperature: current?.variables(1)!.value(),
        isDay: current?.variables(2)!.value(),
        precipitation: current?.variables(3)!.value(),
        rain: current?.variables(4)!.value(),
        latitude,
        longitude,
      },
    };

    return NextResponse.json({ weatherData });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};