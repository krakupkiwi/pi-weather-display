import { useState, useEffect } from 'react';
import type { TideData } from '../types';
import { format, addDays } from 'date-fns';

// Configuration
const TIDE_API = import.meta.env.VITE_TIDE_API || 'worldtides'; // 'noaa' or 'worldtides'
const WORLDTIDES_API_KEY = import.meta.env.VITE_WORLDTIDES_API_KEY || '';
const NOAA_STATION_ID = import.meta.env.VITE_NOAA_STATION || '8518750';

export const useTides = (lat?: string, lon?: string) => {
  const [tides, setTides] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTides = async () => {
      try {
        setLoading(true);

        if (TIDE_API === 'worldtides') {
          await fetchWorldTides(lat, lon);
        } else {
          await fetchNOAATides();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const fetchWorldTides = async (latitude?: string, longitude?: string) => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude required for WorldTides API');
      }

      const today = new Date();
      const start = Math.floor(today.getTime() / 1000);

      // WorldTides has a free tier that doesn't require API key but has limits
      // For production, get a free API key at https://www.worldtides.info/
      const apiKeyParam = WORLDTIDES_API_KEY ? `&key=${WORLDTIDES_API_KEY}` : '';

      const response = await fetch(
        `https://www.worldtides.info/api/v3?extremes&lat=${latitude}&lon=${longitude}&start=${start}&length=${7 * 24 * 3600}${apiKeyParam}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch WorldTides data');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Group tides by day
      const tidesByDay: { [key: string]: TideData } = {};

      if (data.extremes) {
        data.extremes.forEach((extreme: any) => {
          const date = format(new Date(extreme.dt * 1000), 'yyyy-MM-dd');
          if (!tidesByDay[date]) {
            tidesByDay[date] = { date, tides: [] };
          }
          tidesByDay[date].tides.push({
            time: format(new Date(extreme.dt * 1000), 'h:mm a'),
            type: extreme.type === 'High' ? 'high' : 'low',
            height: parseFloat(extreme.height)
          });
        });
      }

      setTides(Object.values(tidesByDay));
      setError(null);
    };

    const fetchNOAATides = async () => {
      const station = NOAA_STATION_ID;
      const today = new Date();
      const beginDate = format(today, 'yyyyMMdd');
      const endDate = format(addDays(today, 7), 'yyyyMMdd');

      const response = await fetch(
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${beginDate}&end_date=${endDate}&station=${station}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=web_services&format=json`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch NOAA tide data');
      }

      const data = await response.json();

      // Group tides by day
      const tidesByDay: { [key: string]: TideData } = {};

      if (data.predictions) {
        data.predictions.forEach((prediction: any) => {
          const date = format(new Date(prediction.t), 'yyyy-MM-dd');
          if (!tidesByDay[date]) {
            tidesByDay[date] = { date, tides: [] };
          }
          tidesByDay[date].tides.push({
            time: format(new Date(prediction.t), 'h:mm a'),
            type: prediction.type === 'H' ? 'high' : 'low',
            height: parseFloat(prediction.v)
          });
        });
      }

      setTides(Object.values(tidesByDay));
      setError(null);
    };

    fetchTides();
    const interval = setInterval(fetchTides, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, [lat, lon]);

  return { tides, loading, error };
};
