import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';
import type { DailyWeather } from '../types';

interface WeeklyForecastProps {
  daily: DailyWeather[];
}

const getWeatherIcon = (main: string, size: number = 24) => {
  const props = { size, className: 'forecast-icon' };
  switch (main.toLowerCase()) {
    case 'clear':
      return <Sun {...props} />;
    case 'clouds':
      return <Cloud {...props} />;
    case 'rain':
    case 'drizzle':
      return <CloudRain {...props} />;
    case 'snow':
      return <CloudSnow {...props} />;
    default:
      return <Wind {...props} />;
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
          {getWeatherIcon(day.weather[0]?.main || '', 28)}
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
