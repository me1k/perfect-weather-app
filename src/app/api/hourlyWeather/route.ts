import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    if (body.fetchParams) {
      const range = (start: number, stop: number, step: number) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, {
        ...body.fetchParams,
        longitude: body.longitude,
        latitude: body.latitude,
      });

      const response = responses[0];
      const hourly = response.hourly()!;
      const latitude = response.latitude();
      const longitude = response.longitude();
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const weatherData = {
        hourly: {
          time: range(
            Number(hourly.time()),
            Number(hourly.timeEnd()),
            hourly.interval()
          ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
          temperature2m: hourly.variables(0)!.valuesArray()!,
          apparentTemperature: hourly.variables(1)!.valuesArray()!,
          precipitationProbability: hourly.variables(2)!.valuesArray()!,
          precipitation: hourly.variables(3)!.valuesArray()!,
          weatherCode: hourly.variables(4)!.valuesArray()!,
          isDay: hourly.variables(5)!.valuesArray()!,
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
