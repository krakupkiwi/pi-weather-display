import { motion } from 'framer-motion';
import ReactAnimatedWeather from 'react-animated-weather';
import type { WeatherData } from '../types';

interface CurrentWeatherProps {
  weather: WeatherData;
}

type WeatherIconType = 'CLEAR_DAY' | 'CLEAR_NIGHT' | 'PARTLY_CLOUDY_DAY' | 'PARTLY_CLOUDY_NIGHT' | 'CLOUDY' | 'RAIN' | 'SLEET' | 'SNOW' | 'WIND' | 'FOG';

const getWeatherIcon = (main: string): WeatherIconType => {
  switch (main.toLowerCase()) {
    case 'clear':
      return 'CLEAR_DAY';
    case 'clouds':
      return 'CLOUDY';
    case 'rain':
      return 'RAIN';
    case 'drizzle':
      return 'RAIN';
    case 'snow':
      return 'SNOW';
    case 'thunderstorm':
      return 'RAIN';
    case 'fog':
    case 'mist':
      return 'FOG';
    default:
      return 'CLOUDY';
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
        <ReactAnimatedWeather
          icon={getWeatherIcon(weatherMain)}
          color="white"
          size={64}
          animate={true}
        />
        <div className="temperature">{Math.round(current.temp)}°</div>
      </div>
      <div className="weather-details">
        <div className="description">{weatherDesc}</div>
        <div className="feels-like">Feels like {Math.round(current.feels_like)}°</div>
        <div className="extra-info">
          <span>💧 {current.humidity}%</span>
          <span>💨 {Math.round(current.wind_speed * 3.6)} km/h</span>
        </div>
      </div>
    </motion.div>
  );
};
