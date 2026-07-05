import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    startRecording?: () => void;
    stopRecording?: () => void;
  }
}

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);
  // We useRef to keep a stable reference to the keys to avoid re-running effects
  // if the durations object reference changes
  const keysRef = useRef(Object.keys(durations));
  const numScenes = keysRef.current.length;
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    // Notify external recorders that playback has started
    window.startRecording?.();
  }, []);

  useEffect(() => {
    const currentKey = keysRef.current[currentScene];
    const duration = durations[currentKey] || 3000;

    const timer = setTimeout(() => {
      // If we just finished the last scene
      if (currentScene === numScenes - 1) {
        if (!hasRecordedRef.current) {
          window.stopRecording?.();
          hasRecordedRef.current = true;
        }
      }
      setCurrentScene((prev) => (prev + 1) % numScenes);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentScene, durations, numScenes]);

  return { currentScene };
}