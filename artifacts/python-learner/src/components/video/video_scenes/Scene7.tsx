import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.h1 
        className="text-[6vw] font-bold text-white text-center leading-tight mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Start learning Python today.
      </motion.h1>

      <motion.div
        className="px-12 py-6 bg-white rounded-full text-violet-900 font-bold text-3xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        Get Started Free
      </motion.div>

      <motion.div 
        className="absolute bottom-16 text-violet-200 text-2xl font-medium tracking-widest"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        PYTHONLEARNER.COM
      </motion.div>
    </motion.div>
  );
}