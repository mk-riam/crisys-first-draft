// Handles microphone recording with real-time waveform analysis

export interface AudioRecordingResult {
  blob: Blob;
  url: string;
  durationSeconds: number;
  recordedAt: number;
}

class EmergencyAudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private startTime: number = 0;
  private isRecordingState: boolean = false;
  private animationFrameId: number | null = null;

  async startRecording(onVolumeLevel?: (volume: number) => void): Promise<boolean> {
    try {
      this.audioChunks = [];
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio analyzer for waveform
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        const source = this.audioContext.createMediaStreamSource(this.audioStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        if (onVolumeLevel) {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          const checkVolume = () => {
            if (!this.isRecordingState || !this.analyser) return;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            onVolumeLevel(Math.min(100, Math.round((average / 128) * 100)));
            this.animationFrameId = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        }
      }

      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(500); // chunk every 500ms
      this.startTime = Date.now();
      this.isRecordingState = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      this.isRecordingState = false;
      return false;
    }
  }

  stopRecording(): Promise<AudioRecordingResult | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecordingState) {
        this.cleanup();
        resolve(null);
        return;
      }

      const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.cleanup();
        resolve({
          blob: audioBlob,
          url: audioUrl,
          durationSeconds,
          recordedAt: Date.now()
        });
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        this.cleanup();
        resolve(null);
      }
    });
  }

  get isRecording() {
    return this.isRecordingState;
  }

  private cleanup() {
    this.isRecordingState = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.mediaRecorder = null;
  }
}

export const emergencyAudioRecorder = new EmergencyAudioRecorder();
