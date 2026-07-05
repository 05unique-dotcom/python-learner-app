import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.h2 
        className="text-[4.5vw] font-bold text-white mb-12 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Interactive Quizzes
      </motion.h2>

      <motion.div 
        className="bg-white rounded-3xl w-[60vw] p-8 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="text-2xl text-slate-500 font-mono mb-4">Question 1 of 5</div>
        <div className="text-3xl text-slate-900 font-semibold mb-8">
          What is the output of `print(2 ** 3)`?
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {['6', '8', '9', 'Error'].map((opt, i) => (
            <motion.div
              key={opt}
              className={`p-6 rounded-xl border-2 text-2xl font-medium ${
                opt === '8' && phase >= 3 
                  ? 'bg-green-100 border-green-500 text-green-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.1 }}
            >
              {opt}
            </motion.div>
          ))}
        </div>

        {phase >= 3 && (
          <motion.div 
            className="mt-8 p-4 bg-green-50 text-green-700 rounded-lg text-xl font-medium flex items-center justify-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <span className="text-3xl">✓</span> Instant Feedback
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}