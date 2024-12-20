import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    if (body.fetchParams) {
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, {
        ...body.fetchParams,
        longitude: body.longitude,
        latitude: body.latitude,
      });

      const response = responses[0];
      const current = response.current();
      const latitude = response.latitude();
      const longitude = response.longitude();

      const weatherData = {
        current: {
          time: new Date(Number(current?.time()) * 1000),
          temperature2m: current?.variables(0)?.value(),
          relativeHumidity2m: current?.variables(1)!.value(),
          apparentTemperature: current?.variables(2)?.value(),
          isDay: current?.variables(2)?.value(),
          precipitation: current?.variables(3)?.value(),
          rain: current?.variables(4)?.value(),
          weatherCode: current?.variables(7)?.value(),
          showers: current?.variables(6)!.value(),
          cloudCover: current?.variables(8)!.value(),
          pressureMsl: current?.variables(9)!.value(),
          surfacePressure: current?.variables(10)!.value(),
          windSpeed10m: current?.variables(11)!.value(),
          windDirection10m: current?.variables(12)!.value(),
          windGusts10m: current?.variables(13)!.value(),
          latitude,
          longitude,
        },
      };

      return NextResponse.json(weatherData);
    } else {
      return NextResponse.json('No fetch params available');
    }
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
