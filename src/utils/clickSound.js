/**
 * Synthesised mechanical-keyboard click using Web Audio API.
 * Short, crisp transient — no audio files needed.
 */

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function playClick() {
  try {
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();
    const now = ac.currentTime;

    // Layer 1: sharp tick (noise burst through tight bandpass)
    const bufLen = Math.floor(ac.sampleRate * 0.012); // 12ms
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      // Decaying noise
      const env = 1 - i / bufLen;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buf;

    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3800;
    bp.Q.value = 2.5;

    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noise.connect(bp).connect(noiseGain).connect(ac.destination);
    noise.start(now);
    noise.stop(now + 0.03);

    // Layer 2: bottom-out thud (low osc)
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.015);

    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(0.18, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(oscGain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (_) {
    // Silently fail if audio not available
  }
}
