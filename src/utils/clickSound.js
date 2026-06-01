/**
 * Premium "creamy thock" mechanical keyboard sound.
 * Dampened tactile press - no harsh click, no rattle, no echo.
 * Three layers: soft tactile top, muted thock body, warm sub rumble.
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

    // Master compressor - glues layers, prevents harshness
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 12;
    comp.ratio.value = 6;
    comp.attack.value = 0.001;
    comp.release.value = 0.04;
    comp.connect(ac.destination);

    // ── Layer 1: Soft tactile top ──────────────────────────
    // Very short filtered noise - the initial "tac" of the keypress
    // Low-passed to remove harshness, shaped with fast exponential decay
    const tacLen = Math.floor(ac.sampleRate * 0.006); // 6ms - ultra short
    const tacBuf = ac.createBuffer(1, tacLen, ac.sampleRate);
    const tacData = tacBuf.getChannelData(0);
    for (let i = 0; i < tacLen; i++) {
      const t = i / tacLen;
      // Fast exponential decay envelope
      const env = Math.exp(-t * 8);
      tacData[i] = (Math.random() * 2 - 1) * env;
    }
    const tacSrc = ac.createBufferSource();
    tacSrc.buffer = tacBuf;

    // Lowpass removes harsh high-end - creamy, not clicky
    const tacLP = ac.createBiquadFilter();
    tacLP.type = 'lowpass';
    tacLP.frequency.value = 2200;
    tacLP.Q.value = 0.7;

    const tacGain = ac.createGain();
    tacGain.gain.setValueAtTime(0.14, now);
    tacGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    tacSrc.connect(tacLP).connect(tacGain).connect(comp);
    tacSrc.start(now);
    tacSrc.stop(now + 0.02);

    // ── Layer 2: Muted thock body ──────────────────────────
    // Bandpassed noise - the dampened "thock" resonance of the switch housing
    // Sits in the mid-low range, decays quickly
    const thockLen = Math.floor(ac.sampleRate * 0.025); // 25ms
    const thockBuf = ac.createBuffer(1, thockLen, ac.sampleRate);
    const thockData = thockBuf.getChannelData(0);
    for (let i = 0; i < thockLen; i++) {
      const t = i / thockLen;
      const env = Math.exp(-t * 5);
      thockData[i] = (Math.random() * 2 - 1) * env;
    }
    const thockSrc = ac.createBufferSource();
    thockSrc.buffer = thockBuf;

    const thockBP = ac.createBiquadFilter();
    thockBP.type = 'bandpass';
    thockBP.frequency.value = 800;
    thockBP.Q.value = 1.2;

    const thockGain = ac.createGain();
    thockGain.gain.setValueAtTime(0.18, now);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    thockSrc.connect(thockBP).connect(thockGain).connect(comp);
    thockSrc.start(now + 0.001); // tiny delay after tactile top
    thockSrc.stop(now + 0.05);

    // ── Layer 3: Warm sub rumble ───────────────────────────
    // Sine wave sweep - the deep "bottom out" feel of the keystroke
    // Very low, very short, felt more than heard
    const sub = ac.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(180, now);
    sub.frequency.exponentialRampToValueAtTime(60, now + 0.03);

    const subGain = ac.createGain();
    subGain.gain.setValueAtTime(0.12, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    sub.connect(subGain).connect(comp);
    sub.start(now + 0.002);
    sub.stop(now + 0.06);
  } catch (_) {
    // Silently fail if audio not available
  }
}
