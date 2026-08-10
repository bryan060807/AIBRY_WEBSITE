class EventHorizonAudio {
  private context: AudioContext | null = null;
  private enabled = false;
  private drone: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) this.getContext()?.resume();
    else this.stop();
  }

  playTransition() {
    const context = this.getContext();
    if (!context || !this.enabled) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(620, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1240, context.currentTime + 0.45);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.85);
  }

  playImpact() {
    const context = this.getContext();
    if (!context || !this.enabled) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(140, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(35, context.currentTime + 0.35);
    gain.gain.setValueAtTime(0.22, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.42);
  }

  playDrone() {
    const context = this.getContext();
    if (!context || !this.enabled || this.drone) return;

    this.drone = context.createOscillator();
    this.droneGain = context.createGain();
    this.drone.type = "sawtooth";
    this.drone.frequency.value = 42;
    this.droneGain.gain.setValueAtTime(0.0001, context.currentTime);
    this.droneGain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.3);
    this.drone.connect(this.droneGain).connect(context.destination);
    this.drone.start();
  }

  stopDrone() {
    if (!this.context || !this.drone || !this.droneGain) return;
    const drone = this.drone;
    const gain = this.droneGain;
    gain.gain.cancelScheduledValues(this.context.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.12);
    drone.stop(this.context.currentTime + 0.14);
    this.drone = null;
    this.droneGain = null;
  }

  stop() {
    this.stopDrone();
  }

  private getContext() {
    if (typeof window === "undefined") return null;
    this.context ??= new AudioContext();
    return this.context;
  }
}

export const eventHorizonAudio = new EventHorizonAudio();
