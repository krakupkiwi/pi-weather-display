import { useMemo } from 'react';
import type { WeatherData, TideData, FishingConditions } from '../types';

const getMoonPhase = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Simplified moon phase calculation
  const c = Math.floor((year - 2000) / 100);
  const e = c * 3 + 3;
  const jd = (367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
             Math.floor(275 * month / 9) + day + 1721028.5) - e;
  const daysSinceNew = (jd - 2451550.1) % 29.53058867;
  const phase = daysSinceNew / 29.53058867;

  if (phase < 0.0625 || phase >= 0.9375) return 'New Moon';
  if (phase < 0.1875) return 'Waxing Crescent';
  if (phase < 0.3125) return 'First Quarter';
  if (phase < 0.4375) return 'Waxing Gibbous';
  if (phase < 0.5625) return 'Full Moon';
  if (phase < 0.6875) return 'Waning Gibbous';
  if (phase < 0.8125) return 'Last Quarter';
  return 'Waning Crescent';
};

export const useFishingConditions = (
  weather: WeatherData | null,
  tides: TideData[]
): FishingConditions => {
  return useMemo(() => {
    let score = 0;
    const factors = {
      moon: '',
      barometer: '',
      tides: '',
      weather: ''
    };

    // Moon phase (best during new and full moon)
    const moonPhase = getMoonPhase();
    factors.moon = moonPhase;
    if (moonPhase === 'New Moon' || moonPhase === 'Full Moon') {
      score += 25;
    } else if (moonPhase.includes('Quarter')) {
      score += 10;
    }

    // Weather conditions
    if (weather) {
      const temp = weather.current.temp;
      const windSpeed = weather.current.wind_speed;

      // Temperature (50-75°F is ideal)
      if (temp >= 50 && temp <= 75) {
        score += 20;
        factors.weather = 'Ideal temperature';
      } else if (temp >= 40 && temp <= 85) {
        score += 10;
        factors.weather = 'Good temperature';
      } else {
        factors.weather = 'Poor temperature';
      }

      // Wind (light to moderate is best, < 15 mph)
      if (windSpeed < 5) {
        score += 15;
      } else if (windSpeed < 15) {
        score += 10;
      } else {
        score -= 10;
        factors.weather += ', windy';
      }

      // Overcast is good for fishing
      const weatherMain = weather.current.weather[0]?.main.toLowerCase();
      if (weatherMain === 'clouds') {
        score += 15;
      } else if (weatherMain === 'clear') {
        score += 5;
      } else if (weatherMain === 'rain') {
        score += 10; // Light rain can be good
      }

      // Barometric pressure (we'll estimate based on weather)
      if (weatherMain === 'clear') {
        factors.barometer = 'High and stable';
        score += 10;
      } else if (weatherMain === 'clouds') {
        factors.barometer = 'Falling (good!)';
        score += 15;
      } else {
        factors.barometer = 'Low';
      }
    } else {
      factors.weather = 'No data';
      factors.barometer = 'No data';
    }

    // Tides (incoming tide is best)
    const today = new Date().toISOString().split('T')[0];
    const todayTides = tides.find(t => t.date === today);
    if (todayTides && todayTides.tides.length > 0) {
      score += 15;
      factors.tides = `${todayTides.tides.length} tide changes today`;
    } else {
      factors.tides = 'No tide data';
    }

    // Determine rating
    let rating: FishingConditions['rating'];
    if (score >= 70) rating = 'excellent';
    else if (score >= 50) rating = 'good';
    else if (score >= 30) rating = 'fair';
    else rating = 'poor';

    return { rating, factors };
  }, [weather, tides]);
};
