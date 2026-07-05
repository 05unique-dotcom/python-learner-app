// Ambient music engine using Web Audio API
// Creates a gentle, looping ambient soundtrack matching the purple/indigo aesthetic

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let scheduledNodes: AudioNode[] = [];

const NOTES = {
  // Pentatonic scale in A minor — pleasant and calming
  A3: 220.0,
  C4: 261.6,
  D4: 293.7,
  E4: 329.6,
  G4: 392.0,
  A4: 440.0,
  C5: 523.3,
  E5: 659.3,
};

const CHORD_PROGRESSION = [
  [NOTES.A3, NOTES.C4, NOTES.E4, NOTES.A4],  // Am
  [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5],  // C
  [NOTES.D4, NOTES.A3, NOTES.E4, NOTES.A4],  // Dm-ish
  [NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5],  // Em
];

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

function createOscillator(
  frequency: number,
  type: OscillatorType,
  gainValue: number,
  startTime: number,
  duration: number,
  destination: AudioNode
): void {
  const audioCtx = getCtx();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.value = 800;
  filter.Q.value = 0.5;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Soft attack and release
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.8);
  gain.gain.setValueAtTime(gainValue, startTime + duration - 1.0);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration);

  scheduledNodes.push(osc, gain, filter);
}

function scheduleChord(
  chord: number[],
  startTime: number,
  duration: number,
  destination: AudioNode
): void {
  chord.forEach((freq, i) => {
    // Slight stagger between notes for a plucked feel
    const noteStart = startTime + i * 0.06;
    createOscillator(freq, "sine", 0.06, noteStart, duration - i * 0.06, destination);
    // Add subtle triangle overtone
    createOscillator(freq * 2, "triangle", 0.015, noteStart, duration - i * 0.06, destination);
  });
}

function scheduleLoop(startTime: number, destination: AudioNode): void {
  const chordDuration = 8.0; // Each chord lasts 8 seconds
  const totalDuration = chordDuration * CHORD_PROGRESSION.length;

  CHORD_PROGRESSION.forEach((chord, i) => {
    scheduleChord(chord, startTime + i * chordDuration, chordDuration + 1.0, destination);
  });

  // Schedule next loop slightly before this one ends (seamless loop)
  const nextLoopStart = startTime + totalDuration - 1.0;

  if (isPlaying && ctx) {
    const delay = (nextLoopStart - ctx.currentTime) * 1000;
    if (delay > 0) {
      setTimeout(() => {
        if (isPlaying && ctx && masterGain) {
          scheduleLoop(ctx.currentTime + 0.5, masterGain);
        }
      }, delay);
    }
  }
}

export function startAudio(): void {
  if (isPlaying) return;
  isPlaying = true;

  const audioCtx = getCtx();

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(audioCtx.destination);

  // Add a subtle reverb via convolver (simple approach: delay + feedback)
  const delayNode = audioCtx.createDelay(2.0);
  delayNode.delayTime.value = 0.35;
  const feedbackGain = audioCtx.createGain();
  feedbackGain.gain.value = 0.3;
  const delayGain = audioCtx.createGain();
  delayGain.gain.value = 0.25;

  masterGain.connect(delayNode);
  delayNode.connect(feedbackGain);
  feedbackGain.connect(delayNode);
  delayNode.connect(delayGain);
  delayGain.connect(audioCtx.destination);

  scheduleLoop(audioCtx.currentTime + 0.2, masterGain);
}

export function stopAudio(): void {
  isPlaying = false;
  if (masterGain) {
    const audioCtx = getCtx();
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
    setTimeout(() => {
      scheduledNodes.forEach((node) => {
        try { node.disconnect(); } catch {}
      });
      scheduledNodes = [];
    }, 1200);
  }
}

export function setVolume(volume: number): void {
  // volume: 0.0 to 1.0
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(volume * 0.5, ctx.currentTime, 0.1);
  }
}

export function isAudioPlaying(): boolean {
  return isPlaying;
}
