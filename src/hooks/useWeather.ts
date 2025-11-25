import { useState, useEffect } from 'react';
import type { WeatherData, DailyWeather } from '../types';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const DEFAULT_LAT = '40.7128'; // Default to NYC
const DEFAULT_LON = '-74.0060';

// Helper function to process 3-hour forecast data into daily summaries
const processForecastData = (forecastList: any[]): DailyWeather[] => {
  const dailyData: { [key: string]: any } = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();

    if (!dailyData[date]) {
      dailyData[date] = {
        dt: item.dt,
        temps: [],
        weather: item.weather,
        pop: item.pop || 0,
      };
    }

    dailyData[date].temps.push(item.main.temp);
    dailyData[date].pop = Math.max(dailyData[date].pop, item.pop || 0);
  });

  return Object.values(dailyData).map((day: any) => ({
    dt: day.dt,
    temp: {
      day: day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length,
      min: Math.min(...day.temps),
      max: Math.max(...day.temps),
    },
    weather: day.weather,
    pop: day.pop,
  }));
};

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

        // Fetch current weather (free tier)
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!currentResponse.ok) {
          const errorData = await currentResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${currentResponse.status}`);
        }

        const currentData = await currentResponse.json();

        // Fetch 7-day forecast (free tier - 5 day/3 hour is the free one)
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!forecastResponse.ok) {
          const errorData = await forecastResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `API Error: ${forecastResponse.status}`);
        }

        const forecastData = await forecastResponse.json();

        // Transform data to match our WeatherData structure
        const transformedData: WeatherData = {
          current: {
            temp: currentData.main.temp,
            feels_like: currentData.main.feels_like,
            humidity: currentData.main.humidity,
            weather: currentData.weather,
            wind_speed: currentData.wind.speed,
          },
          daily: processForecastData(forecastData.list),
        };

        setWeather(transformedData);
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
