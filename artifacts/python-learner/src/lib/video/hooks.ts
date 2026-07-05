import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    startRecording?: () => void;
    stopRecording?: () => void;
  }
}

export function useVideoPlayer({
  durations,
  paused = false,
  speed = 1,
}: {
  durations: Record<string, number>;
  paused?: boolean;
  speed?: number;
}) {
  const [currentScene, setCurrentScene] = useState(0);
  const keysRef = useRef(Object.keys(durations));
  const numScenes = keysRef.current.length;
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    window.startRecording?.();
  }, []);

  useEffect(() => {
    if (paused) return;

    const currentKey = keysRef.current[currentScene];
    const baseDuration = durations[currentKey] || 3000;
    const duration = baseDuration / speed;

    const timer = setTimeout(() => {
      if (currentScene === numScenes - 1) {
        if (!hasRecordedRef.current) {
          window.stopRecording?.();
          hasRecordedRef.current = true;
        }
      }
      setCurrentScene((prev) => (prev + 1) % numScenes);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentScene, durations, numScenes, paused, speed]);

  return { currentScene, setCurrentScene };
}
