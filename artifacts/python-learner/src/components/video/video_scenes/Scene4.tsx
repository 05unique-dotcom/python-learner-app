import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const badges = [
    { title: 'First Code', color: 'bg-amber-400' },
    { title: 'Loop Master', color: 'bg-blue-400' },
    { title: 'Function Guru', color: 'bg-rose-400' },
    { title: 'Bug Hunter', color: 'bg-emerald-400' },
    { title: 'Data Wizard', color: 'bg-cyan-400' },
    { title: 'Fast Learner', color: 'bg-orange-400' },
    { title: 'Pythonista', color: 'bg-violet-400' },
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.h2 
        className="text-[4.5vw] font-bold text-slate-900 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Collect <span className="text-violet-600">Achievement Badges</span>
      </motion.h2>

      <motion.div className="flex flex-wrap justify-center gap-8 max-w-[80vw] mt-12">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.title}
            className="flex flex-col items-center"
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={phase >= 1 ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15, 
              delay: i * 0.2 + (phase >= 1 ? 0 : 10) 
            }}
          >
            <div className={`w-32 h-32 rounded-full ${badge.color} shadow-2xl border-4 border-white flex items-center justify-center mb-4`}>
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-4xl text-white">⭐</span>
              </div>
            </div>
            <div className="text-xl font-bold text-slate-700">{badge.title}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}