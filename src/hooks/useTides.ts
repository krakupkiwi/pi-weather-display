import { useState, useEffect } from 'react';
import type { TideData } from '../types';
import { format, addDays } from 'date-fns';

// NOAA station ID - default to a popular location (The Battery, NY)
const DEFAULT_STATION_ID = '8518750';

export const useTides = (stationId?: string) => {
  const [tides, setTides] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTides = async () => {
      try {
        setLoading(true);
        const station = stationId || DEFAULT_STATION_ID;
        const today = new Date();
        const beginDate = format(today, 'yyyyMMdd');
        const endDate = format(addDays(today, 7), 'yyyyMMdd');

        const response = await fetch(
          `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${beginDate}&end_date=${endDate}&station=${station}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=web_services&format=json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch tide data');
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTides();
    const interval = setInterval(fetchTides, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, [stationId]);

  return { tides, loading, error };
};
