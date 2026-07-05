import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Gauge, Monitor, ChevronDown
} from "lucide-react";
import { startAudio, stopAudio, setVolume } from "@/lib/video/audioEngine";
import VideoTemplate from "./VideoTemplate";

const SCENE_LABELS = [
  "Intro",
  "Lessons",
  "Quizzes",
  "Badges",
  "Certificate",
  "Streak",
  "Closing",
];

const TOTAL_SCENES = SCENE_LABELS.length;
const SCENE_DURATIONS_MS = [5000, 6000, 6000, 6000, 6000, 6000, 6000];
const TOTAL_DURATION_MS = SCENE_DURATIONS_MS.reduce((a, b) => a + b, 0);

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];
const QUALITY_OPTIONS = ["HD", "SD"];

export function VideoPlayer() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(true); // start muted; user must opt in for audio
  const [quality, setQuality] = useState("HD");
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentScene, setCurrentSceneExt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioStartedRef = useRef(false);

  // Auto-hide controls after 3s of no movement
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  // Elapsed time tracker for progress bar
  useEffect(() => {
    if (paused) {
      if (elapsedTimer.current) clearInterval(elapsedTimer.current);
      return;
    }
    elapsedTimer.current = setInterval(() => {
      setElapsed((e) => (e + 200 * speed) % TOTAL_DURATION_MS);
    }, 200);
    return () => {
      if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    };
  }, [paused, speed]);

  // Sync audio mute/unmute
  useEffect(() => {
    if (!muted) {
      if (!audioStartedRef.current) {
        startAudio();
        audioStartedRef.current = true;
      }
      setVolume(volume);
    } else {
      setVolume(0);
    }
  }, [muted, volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const togglePause = () => {
    setPaused((p) => !p);
    showControls();
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    showControls();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    if (v > 0 && muted) setMuted(false);
    showControls();
  };

  const handleSpeedSelect = (s: number) => {
    setSpeed(s);
    setShowSpeedMenu(false);
    showControls();
  };

  const handleQualitySelect = (q: string) => {
    setQuality(q);
    setShowQualityMenu(false);
    showControls();
  };

  const progressPct = (elapsed / TOTAL_DURATION_MS) * 100;

  // Compute which scene we're on from elapsed
  const computedScene = (() => {
    let acc = 0;
    for (let i = 0; i < SCENE_DURATIONS_MS.length; i++) {
      acc += SCENE_DURATIONS_MS[i];
      if (elapsed < acc) return i;
    }
    return SCENE_DURATIONS_MS.length - 1;
  })();

  useEffect(() => {
    setCurrentSceneExt(computedScene);
  }, [computedScene]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseMove={showControls}
      onTouchStart={showControls}
      onClick={(e) => {
        // Click on video area (not controls) to toggle pause
        if ((e.target as HTMLElement).closest("[data-controls]")) return;
        togglePause();
      }}
      style={{ cursor: controlsVisible ? "default" : "none" }}
    >
      {/* Video canvas — quality filter in SD mode */}
      <div
        className="w-full h-full"
        style={quality === "SD" ? { filter: "contrast(0.95) saturate(0.85)" } : {}}
      >
        <VideoTemplate paused={paused} speed={speed} />
      </div>

      {/* Pause overlay icon (center flash) */}
      <AnimatePresence>
        {paused && (
          <motion.div
            key="pause-icon"
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-full p-6">
              <Pause className="w-12 h-12 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            key="controls"
            data-controls
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Progress bar */}
            <div className="relative w-full h-1 bg-white/20 rounded-full mb-3 group cursor-pointer">
              <div
                className="h-full bg-violet-400 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
              {/* Scene markers */}
              {SCENE_DURATIONS_MS.slice(0, -1).reduce<{ pct: number; label: string }[]>((acc, dur, i) => {
                const prev = acc[i - 1]?.pct ?? 0;
                acc.push({ pct: prev + (dur / TOTAL_DURATION_MS) * 100, label: SCENE_LABELS[i + 1] });
                return acc;
              }, []).map(({ pct, label }, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"
                  style={{ left: `${pct}%` }}
                  title={label}
                />
              ))}
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePause}
                className="text-white hover:text-violet-300 transition-colors"
                aria-label={paused ? "Play" : "Pause"}
              >
                {paused ? <Play className="w-6 h-6 fill-white" /> : <Pause className="w-6 h-6" />}
              </button>

              {/* Time */}
              <span className="text-white/70 text-xs font-mono tabular-nums select-none">
                {formatTime(elapsed)} / {formatTime(TOTAL_DURATION_MS)}
              </span>

              {/* Scene label */}
              <span className="hidden sm:inline text-white/50 text-xs select-none">
                {SCENE_LABELS[currentScene]}
              </span>

              {/* Scene dots */}
              <div className="flex items-center gap-1.5 flex-1 justify-center">
                {SCENE_LABELS.map((label, i) => (
                  <div
                    key={i}
                    title={label}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentScene
                        ? "w-4 h-2 bg-violet-400"
                        : i < currentScene
                        ? "w-2 h-2 bg-white/60"
                        : "w-2 h-2 bg-white/25"
                    }`}
                  />
                ))}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-violet-300 transition-colors"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-18 h-1 accent-violet-400 cursor-pointer hidden sm:block"
                  style={{ width: "72px" }}
                />
              </div>

              {/* Speed */}
              <div className="relative">
                <button
                  onClick={() => { setShowSpeedMenu((s) => !s); setShowQualityMenu(false); }}
                  className="flex items-center gap-1 text-white hover:text-violet-300 transition-colors text-sm font-medium"
                >
                  <Gauge className="w-4 h-4" />
                  <span className="hidden sm:inline">{speed}x</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showSpeedMenu && (
                    <motion.div
                      key="speed-menu"
                      className="absolute bottom-8 right-0 bg-black/90 backdrop-blur border border-white/10 rounded-lg overflow-hidden min-w-[80px]"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      {SPEED_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedSelect(s)}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-violet-600/40 transition-colors ${
                            speed === s ? "text-violet-300 font-semibold" : "text-white/80"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quality */}
              <div className="relative">
                <button
                  onClick={() => { setShowQualityMenu((q) => !q); setShowSpeedMenu(false); }}
                  className="flex items-center gap-1 text-white hover:text-violet-300 transition-colors text-sm font-medium"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="hidden sm:inline">{quality}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showQualityMenu && (
                    <motion.div
                      key="quality-menu"
                      className="absolute bottom-8 right-0 bg-black/90 backdrop-blur border border-white/10 rounded-lg overflow-hidden min-w-[80px]"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      {QUALITY_OPTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualitySelect(q)}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-violet-600/40 transition-colors ${
                            quality === q ? "text-violet-300 font-semibold" : "text-white/80"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar — title */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            key="top-bar"
            className="absolute top-0 left-0 right-0 px-5 pt-4 pb-8 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">Python Learner</span>
              <span className="text-white/40 text-xs">—</span>
              <span className="text-white/60 text-xs">{SCENE_LABELS[currentScene]}</span>
              {quality === "HD" && (
                <span className="ml-1 px-1.5 py-0.5 bg-violet-500/30 border border-violet-400/30 text-violet-300 text-[10px] font-bold rounded tracking-wider">
                  HD
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
