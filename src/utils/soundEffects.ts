// Synthesizes Web Audio API emergency sounds with zero external file dependencies

class SoundEffectsController {
  private audioCtx: AudioContext | null = null;
  private activeOscillator: OscillatorNode | null = null;
  private activeGain: GainNode | null = null;
  private sirenInterval: any = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // High-decibel police / crisis siren
  playEmergencySiren(volume: number = 0.8) {
    this.stopSound();
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    let high = true;
    osc.frequency.setValueAtTime(960, this.audioCtx.currentTime);
    osc.start();

    this.activeOscillator = osc;
    this.activeGain = gain;

    this.sirenInterval = setInterval(() => {
      if (!this.audioCtx || !this.activeOscillator) return;
      const targetFreq = high ? 650 : 1100;
      this.activeOscillator.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.12);
      high = !high;
    }, 450);
  }

  // Urgent recurring responder chime (for 100m broadcast receiver)
  playResponderAlertChime() {
    this.stopSound();
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    let step = 0;
    const notes = [880, 1174, 1318, 1760];
    osc.frequency.setValueAtTime(notes[0], this.audioCtx.currentTime);
    osc.start();

    this.activeOscillator = osc;
    this.activeGain = gain;

    this.sirenInterval = setInterval(() => {
      if (!this.audioCtx || !this.activeOscillator) return;
      step = (step + 1) % notes.length;
      this.activeOscillator.frequency.setValueAtTime(notes[step], this.audioCtx.currentTime);
    }, 280);
  }

  // Single short tactile beep
  playConfirmationBeep() {
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, this.audioCtx.currentTime); // C6
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.2);
  }

  stopSound() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      this.activeOscillator = null;
    }
    if (this.activeGain) {
      this.activeGain.disconnect();
      this.activeGain = null;
    }
  }
}

export const soundEffects = new SoundEffectsController();
