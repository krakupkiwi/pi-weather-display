import { motion } from 'framer-motion';
import { Fish } from 'lucide-react';
import type { FishingConditions as FishingConditionsType } from '../types';

interface FishingConditionsProps {
  conditions: FishingConditionsType;
}

const getRatingColor = (rating: FishingConditionsType['rating']) => {
  switch (rating) {
    case 'excellent':
      return '#22c55e';
    case 'good':
      return '#84cc16';
    case 'fair':
      return '#eab308';
    case 'poor':
      return '#ef4444';
  }
};

const getRatingText = (rating: FishingConditionsType['rating']) => {
  switch (rating) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'fair':
      return 'Fair';
    case 'poor':
      return 'Poor';
  }
};

export const FishingConditions = ({ conditions }: FishingConditionsProps) => {
  const color = getRatingColor(conditions.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fishing-conditions"
    >
      <div className="section-title">
        <Fish size={20} />
        <span>Fishing Forecast</span>
      </div>
      <div className="fishing-rating" style={{ borderColor: color }}>
        <div className="rating-indicator" style={{ backgroundColor: color }}>
          {getRatingText(conditions.rating)}
        </div>
        <div className="rating-factors">
          <div className="factor">
            <span className="factor-label">🌙 Moon:</span>
            <span className="factor-value">{conditions.factors.moon}</span>
          </div>
          <div className="factor">
            <span className="factor-label">🌡️ Barometer:</span>
            <span className="factor-value">{conditions.factors.barometer}</span>
          </div>
          <div className="factor">
            <span className="factor-label">🌊 Tides:</span>
            <span className="factor-value">{conditions.factors.tides}</span>
          </div>
          <div className="factor">
            <span className="factor-label">☁️ Weather:</span>
            <span className="factor-value">{conditions.factors.weather}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
