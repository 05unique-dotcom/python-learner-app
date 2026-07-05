import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-row items-center px-[10vw] z-10"
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <div className="w-1/2 pr-12">
        <motion.h2 
          className="text-[4.5vw] font-bold text-white leading-tight"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Earn Your<br/>
          <span className="text-violet-200">Certificate</span>
        </motion.h2>
        <motion.p 
          className="text-[2vw] text-violet-100 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Printable, personalized, and ready to share.
        </motion.p>
      </div>

      <div className="w-1/2">
        <motion.div 
          className="bg-white aspect-[1.414] rounded-sm shadow-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          <div className="absolute inset-4 border-2 border-violet-900/10"></div>
          <div className="absolute inset-6 border border-violet-900/5"></div>
          
          <motion.div 
            className="text-4xl font-serif text-violet-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          >
            Certificate of Completion
          </motion.div>
          
          <motion.div 
            className="text-lg text-slate-500 mb-4"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            This certifies that
          </motion.div>
          
          <motion.div 
            className="text-5xl font-script text-slate-900 mb-4 border-b pb-2 px-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Jane Doe
          </motion.div>
          
          <motion.div 
            className="text-xl text-slate-600 max-w-md text-center"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            has successfully completed the Python Learner curriculum
          </motion.div>

          <motion.div 
            className="absolute bottom-12 right-12 w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center text-white"
            initial={{ scale: 0 }}
            animate={phase >= 2 ? { scale: 1, rotate: [-20, 0] } : {}}
            transition={{ type: 'spring', delay: 1 }}
          >
            Seal
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}