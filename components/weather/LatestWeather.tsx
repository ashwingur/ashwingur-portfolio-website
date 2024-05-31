import { useQuery } from "react-query";
import axios from "axios";
import { WeatherData } from "../../shared/interfaces/weather.interface";
import Thermometer from "./Thermometer";
import PressureGauge from "./PressureGauge";
import AirQuality from "./AirQuality";

function formatUnixTimestamp(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

function calculateMinutesAgo(unixTimestamp: number) {
  const now = Date.now() / 1000; // Convert milliseconds to seconds
  const differenceInSeconds = now - unixTimestamp;
  const minutesAgo = Math.floor(differenceInSeconds / 60);
  return minutesAgo;
}

export const fetchLatestWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await axios.get<WeatherData>(
      `${process.env.NEXT_PUBLIC_ASHWINGUR_API}/weather`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch weather data ${error}`);
  }
};

export const LatestWeather: React.FC = () => {
  const { data, isLoading, isError } = useQuery<WeatherData>(
    "latestweather",
    fetchLatestWeatherData
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError || data === undefined)
    return <div>Error fetching weather data</div>;

  const [timestamp, temperature, pressure, humidity, light, aqi, tvoc, eco2] =
    data.data[0];

  return (
    <div className="flex flex-col items-center justify-center bg-stone-100/80 dark:bg-stone-800/80 rounded-lg mx-4 py-2 shadow-md">
      <h2 className="mt-2">Latest Weather Data</h2>
      <p className="text-sm mt-1">
        {formatUnixTimestamp(timestamp)} ({calculateMinutesAgo(timestamp)}min
        ago)
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 justify-center items-stretch">
        <Thermometer temperature={temperature} />
        <PressureGauge pressure={pressure} />
        <div className="flex flex-col text-center justify-center gap-8 bg-stone-100 dark:bg-stone-700/25 shadow-lg rounded-lg p-2">
          <div>
            <h3>Humidity</h3>
            {humidity.toFixed(2)}%
          </div>
          <div>
            <h3>Ambient Light</h3>
            {light.toFixed(2)} lx
          </div>
        </div>
        <AirQuality aqi={aqi} tvoc={tvoc} eco2={eco2} />
      </div>
    </div>
  );
};
