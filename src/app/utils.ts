export const POPULAR_CITIES = [
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  { name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
  { name: 'Munich', lat: 48.1351, lon: 11.582 },
  { name: 'Leipzig', lat: 51.3397, lon: 12.3731 },
  { name: 'Kiel', lat: 54.3213, lon: 10.1349 },
  { name: 'Frankfurt-am-Main', lat: 50.1109, lon: 8.6821 },
];

export const weatherCodeToIcon: { [key: number]: string } = {
  0: '01d', // Clear sky
  1: '02d', // Mainly clear
  2: '03d', // Partly cloudy
  3: '04d', // Overcast
  45: '50d', // Fog
  48: '50d', // Depositing rime fog
  51: '09d', // Drizzle: Light intensity
  61: '10d', // Rain: Slight
  80: '09d', // Rain showers: Slight
  95: '11d', // Thunderstorm: Moderate
};
