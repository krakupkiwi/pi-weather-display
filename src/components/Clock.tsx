import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="clock"
    >
      <div className="time">{format(time, 'h:mm')}</div>
      <div className="period">{format(time, 'a')}</div>
      <div className="date">{format(time, 'EEEE, MMMM d')}</div>
    </motion.div>
  );
};
