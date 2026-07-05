import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

const SCENE_DURATIONS = {
  intro: 5000,
  lessons: 6000,
  quizzes: 6000,
  badges: 6000,
  certificate: 6000,
  streak: 6000,
  closing: 6000,
};

const bgColors = [
  '#6d28d9', // intro
  '#f8fafc', // lessons
  '#4c1d95', // quizzes
  '#f1f5f9', // badges
  '#5b21b6', // certificate
  '#ffffff', // streak
  '#6d28d9', // closing
];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white text-slate-900 font-sans">
      {/* Persistent Background Layer */}
      <motion.div 
        className="absolute inset-0"
        animate={{ backgroundColor: bgColors[currentScene] }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.div className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}
          animate={{ 
            x: ['-20%', '80%', '20%'], 
            y: ['20%', '60%', '10%'], 
            scale: [1, 1.4, 0.9] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[60vw] h-[60vw] rounded-full opacity-15 blur-3xl right-0 bottom-0"
          style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }}
          animate={{ x: ['10%', '-50%', '5%'], y: ['-10%', '-60%', '-20%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>

      {/* Foreground Content inside AnimatePresence */}
      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="intro" />}
        {currentScene === 1 && <Scene2 key="lessons" />}
        {currentScene === 2 && <Scene3 key="quizzes" />}
        {currentScene === 3 && <Scene4 key="badges" />}
        {currentScene === 4 && <Scene5 key="certificate" />}
        {currentScene === 5 && <Scene6 key="streak" />}
        {currentScene === 6 && <Scene7 key="closing" />}
      </AnimatePresence>
    </div>
  );
}