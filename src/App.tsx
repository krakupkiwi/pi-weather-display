import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './ThemeContext';
import { useWeather } from './hooks/useWeather';
import { useTides } from './hooks/useTides';
import { useFishingConditions } from './hooks/useFishingConditions';
import { Clock } from './components/Clock';
import { CurrentWeather } from './components/CurrentWeather';
import { WeeklyForecast } from './components/WeeklyForecast';
import { Tides } from './components/Tides';
import { FishingConditions } from './components/FishingConditions';
import './App.css';

type View = 'main' | 'tides';

function AppContent() {
  const { theme } = useTheme();
  const [view, setView] = useState<View>('main');

  // Get coordinates from environment or use defaults
  const lat = import.meta.env.VITE_LATITUDE;
  const lon = import.meta.env.VITE_LONGITUDE;
  const stationId = import.meta.env.VITE_TIDE_STATION;

  const { weather, loading: weatherLoading, error: weatherError } = useWeather(lat, lon);
  const { tides, loading: tidesLoading, error: tidesError } = useTides(stationId);
  const fishingConditions = useFishingConditions(weather, tides);

  const toggleView = () => {
    setView(prev => prev === 'main' ? 'tides' : 'main');
  };

  if (weatherLoading && tidesLoading) {
    return (
      <div className={`app ${theme}`}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`} onClick={toggleView}>
      <AnimatePresence mode="wait">
        {view === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="main-view"
          >
            <Clock />

            {weatherError ? (
              <div className="error">
                <p>Weather Error: {weatherError}</p>
                <p className="hint">Check your API key and coordinates</p>
              </div>
            ) : weather ? (
              <>
                <CurrentWeather weather={weather} />
                <WeeklyForecast daily={weather.daily} />
              </>
            ) : null}

            <FishingConditions conditions={fishingConditions} />

            <div className="tap-hint">Tap to view tides</div>
          </motion.div>
        ) : (
          <motion.div
            key="tides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="tides-view"
          >
            <Clock />

            {tidesError ? (
              <div className="error">
                <p>Tide Error: {tidesError}</p>
                <p className="hint">Check your tide station ID</p>
              </div>
            ) : (
              <Tides tides={tides} />
            )}

            <FishingConditions conditions={fishingConditions} />

            <div className="tap-hint">Tap to view weather</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
