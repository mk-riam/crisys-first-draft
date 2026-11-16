// Manages device flashlight torch & strobe control via MediaStream track constraints

class TorchController {
  private stream: MediaStream | null = null;
  private track: MediaStreamTrack | null = null;
  private strobeInterval: any = null;
  private isTorchSupported: boolean = false;
  private isTorchOn: boolean = false;

  async initTorch(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      });
      this.track = this.stream.getVideoTracks()[0];
      const capabilities = (this.track.getCapabilities && this.track.getCapabilities()) as any;
      this.isTorchSupported = !!(capabilities && capabilities.torch);
      return this.isTorchSupported;
    } catch (err) {
      console.warn('Camera flash not accessible or permission denied:', err);
      this.isTorchSupported = false;
      return false;
    }
  }

  async setTorch(on: boolean) {
    if (!this.track || !this.isTorchSupported) {
      this.isTorchOn = on;
      return;
    }
    try {
      await (this.track as any).applyConstraints({
        advanced: [{ torch: on }]
      });
      this.isTorchOn = on;
    } catch (err) {
      console.warn('Failed to set torch constraint:', err);
    }
  }

  startStrobe(intervalMs: number = 100) {
    this.stopStrobe();
    let state = false;
    this.strobeInterval = setInterval(async () => {
      state = !state;
      await this.setTorch(state);
    }, intervalMs);
  }

  stopStrobe() {
    if (this.strobeInterval) {
      clearInterval(this.strobeInterval);
      this.strobeInterval = null;
    }
    this.setTorch(false);
  }

  cleanup() {
    this.stopStrobe();
    if (this.track) {
      this.track.stop();
      this.track = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  get isSupported() {
    return this.isTorchSupported;
  }

  get isOn() {
    return this.isTorchOn;
  }
}

export const torchController = new TorchController();
