import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const lessons = ['Variables', 'Loops', 'Functions', 'Classes', 'Modules', 'File I/O'];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-row items-center px-[10vw] z-10"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-1/2">
        <motion.h2 
          className="text-[5vw] font-bold text-slate-900 leading-tight"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Structured<br/>
          <span className="text-violet-700">Lessons</span>
        </motion.h2>
        <motion.p 
          className="text-[1.8vw] text-slate-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Master the fundamentals step-by-step.
        </motion.p>
      </div>

      <div className="w-1/2 flex flex-col gap-4">
        {lessons.map((lesson, i) => (
          <motion.div 
            key={lesson}
            className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
            initial={{ opacity: 0, x: 100 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.15 + (phase >= 1 ? 0 : 10) }}
          >
            <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xl">
              {i + 1}
            </div>
            <span className="text-2xl font-semibold text-slate-800">{lesson}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}