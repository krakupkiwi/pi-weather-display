import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ReactAnimatedWeather from 'react-animated-weather';
import type { DailyWeather } from '../types';

interface WeeklyForecastProps {
  daily: DailyWeather[];
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

export const WeeklyForecast = ({ daily }: WeeklyForecastProps) => {
  return (
    <div className="weekly-forecast">
      {daily.slice(1, 8).map((day, index) => (
        <motion.div
          key={day.dt}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          className="forecast-day"
        >
          <div className="day-name">
            {format(new Date(day.dt * 1000), 'EEE')}
          </div>
          <ReactAnimatedWeather
            icon={getWeatherIcon(day.weather[0]?.main || '')}
            color="white"
            size={32}
            animate={true}
          />
          <div className="temp-range">
            <span className="temp-high">{Math.round(day.temp.max)}°</span>
            <span className="temp-low">{Math.round(day.temp.min)}°</span>
          </div>
          {day.pop > 0 && (
            <div className="precipitation">{Math.round(day.pop * 100)}%</div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
