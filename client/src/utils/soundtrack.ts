class AmbientSoundtrackController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: any = null;
  private volume: number = 0.35;
  private masterGain: GainNode | null = null;

  // Chill ambient chord progressions (Frequencies in Hz)
  // Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
  private chords = [
    [130.81, 196.0, 246.94, 293.66, 329.63], // C, G, B, D, E
    [110.0, 164.81, 220.0, 261.63, 329.63],  // A, E, A, C, E
    [87.31, 130.81, 174.61, 220.0, 261.63],  // F, C, F, A, C
    [98.0, 146.83, 196.0, 261.63, 293.66],   // G, D, G, C, D
  ];
  private chordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  private playChord() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    const now = this.ctx.currentTime;
    const duration = 4.5; // seconds per ambient chord

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(700, now + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(350, now + duration);

      // Soft envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    this.timer = setTimeout(() => {
      this.playChord();
    }, 4200);
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    this.isPlaying = true;
    this.playChord();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSoundtrack = new AmbientSoundtrackController();
