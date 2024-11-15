interface WeatherProps {
  weatherCode: number; // Open-Meteo's weathercode
  temperature: number;
  cityName: string;
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

const WeatherCard: React.FC<WeatherProps> = ({
  weatherCode,
  temperature,
  cityName,
}) => {
  const iconCode = weatherCodeToIcon[weatherCode] || '01d'; // Default to clear sky if code is missing
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="bg-white dark:bg-gray-700 shadow rounded p-4 text-center">
      <h3 className="font-semibold mb-2">{cityName}</h3>
      <img src={iconUrl} alt="Weather Icon" className="mx-auto" />
      <p className="text-lg">{temperature}°C</p>
    </div>
  );
};

export default WeatherCard;
