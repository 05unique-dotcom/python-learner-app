import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <motion.div 
          className="absolute -inset-8 bg-white/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.h1 
          className="text-[8vw] font-bold text-white tracking-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          Python<span className="text-violet-300">Learner</span>
        </motion.h1>
      </div>

      <motion.p 
        className="text-[2vw] text-violet-200 mt-6 max-w-[60vw] text-center font-medium"
        initial={{ y: 20, opacity: 0 }}
        animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        The interactive platform to master Python programming.
      </motion.p>
      
      <motion.div
        className="mt-12 w-32 h-1 bg-violet-400 rounded-full"
        initial={{ width: 0 }}
        animate={phase >= 2 ? { width: '8vw' } : { width: 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}