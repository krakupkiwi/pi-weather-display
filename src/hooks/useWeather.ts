import { useState, useEffect } from 'react';
import type { WeatherData } from '../types';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const DEFAULT_LAT = '40.7128'; // Default to NYC
const DEFAULT_LON = '-74.0060';

export const useWeather = (lat?: string, lon?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const latitude = lat || DEFAULT_LAT;
        const longitude = lon || DEFAULT_LON;

        if (!OPENWEATHER_API_KEY) {
          throw new Error('OpenWeather API key not configured');
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, [lat, lon]);

  return { weather, loading, error };
};
