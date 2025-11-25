import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';
import type { WeatherData } from '../types';

interface CurrentWeatherProps {
  weather: WeatherData;
}

const getWeatherIcon = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clear':
      return <Sun className="weather-icon" />;
    case 'clouds':
      return <Cloud className="weather-icon" />;
    case 'rain':
    case 'drizzle':
      return <CloudRain className="weather-icon" />;
    case 'snow':
      return <CloudSnow className="weather-icon" />;
    default:
      return <Wind className="weather-icon" />;
  }
};

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  const current = weather.current;
  const weatherMain = current.weather[0]?.main || '';
  const weatherDesc = current.weather[0]?.description || '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="current-weather"
    >
      <div className="weather-main">
        {getWeatherIcon(weatherMain)}
        <div className="temperature">{Math.round(current.temp)}°</div>
      </div>
      <div className="weather-details">
        <div className="description">{weatherDesc}</div>
        <div className="feels-like">Feels like {Math.round(current.feels_like)}°</div>
        <div className="extra-info">
          <span>💧 {current.humidity}%</span>
          <span>💨 {Math.round(current.wind_speed)} mph</span>
        </div>
      </div>
    </motion.div>
  );
};
