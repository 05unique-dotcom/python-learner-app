import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const days = Array.from({ length: 28 }, (_, i) => {
    // Generate a heatmap pattern
    const isActive = i > 5 && i < 25 && Math.random() > 0.2;
    return isActive;
  });

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, filter: 'blur(20px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="flex items-center gap-6 mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-7xl">🔥</span>
        <h2 className="text-[5vw] font-bold text-slate-900">
          Daily <span className="text-orange-500">Streak</span>
        </h2>
      </motion.div>

      <motion.div 
        className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-slate-500 font-medium text-xl">Current Streak</div>
            <div className="text-6xl font-bold text-orange-500 mt-2">14 Days</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 font-medium text-xl">Longest Streak</div>
            <div className="text-4xl font-bold text-slate-700 mt-2">21 Days</div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map((isActive, i) => (
            <motion.div
              key={i}
              className={`w-12 h-12 rounded-lg ${isActive ? 'bg-orange-500' : 'bg-slate-200'}`}
              initial={{ scale: 0 }}
              animate={phase >= 2 ? { scale: 1 } : {}}
              transition={{ delay: i * 0.05 + (phase >= 2 ? 0 : 10) }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}