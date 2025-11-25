import { motion } from 'framer-motion';
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

function AppContent() {
  const { theme } = useTheme();

  // Get coordinates from environment or use defaults
  const lat = import.meta.env.VITE_LATITUDE;
  const lon = import.meta.env.VITE_LONGITUDE;

  const { weather, loading: weatherLoading, error: weatherError } = useWeather(lat, lon);
  const { tides, loading: tidesLoading, error: tidesError } = useTides(lat, lon);
  const fishingConditions = useFishingConditions(weather, tides);

  if (weatherLoading && tidesLoading) {
    return (
      <div className={`app ${theme}`}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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

        <div className="bottom-section">
          {tidesError ? (
            <div className="error">
              <p>Tide Error: {tidesError}</p>
              <p className="hint">Check your coordinates and VITE_TIDE_API setting</p>
            </div>
          ) : (
            <Tides tides={tides} />
          )}

          <FishingConditions conditions={fishingConditions} />
        </div>
      </motion.div>
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
