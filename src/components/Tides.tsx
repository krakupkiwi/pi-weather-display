import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { TideData } from '../types';

interface TidesProps {
  tides: TideData[];
}

export const Tides = ({ tides }: TidesProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayTides = tides.find(t => t.date === today);

  if (!todayTides || todayTides.tides.length === 0) {
    return (
      <div className="tides">
        <div className="section-title">Tides</div>
        <div className="no-data">No tide data available</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="tides"
    >
      <div className="section-title">Today's Tides</div>
      <div className="tide-list">
        {todayTides.tides.map((tide, index) => (
          <div key={index} className="tide-item">
            {tide.type === 'high' ? (
              <ArrowUp className="tide-icon high" size={20} />
            ) : (
              <ArrowDown className="tide-icon low" size={20} />
            )}
            <div className="tide-info">
              <span className="tide-time">{tide.time}</span>
              <span className="tide-type">{tide.type === 'high' ? 'High' : 'Low'}</span>
              <span className="tide-height">{tide.height.toFixed(1)} ft</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
