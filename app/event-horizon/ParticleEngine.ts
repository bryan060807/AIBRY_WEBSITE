import { eventHorizonAudio } from "./audio";

const COLORS = ["#4285f4", "#ea4335", "#fbbc05", "#34a853"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  color: string;
  radius: number;
};

export class ParticleEngine {
  private readonly context: CanvasRenderingContext2D;
  private readonly particles: Particle[] = [];
  private frame = 0;
  private width = 0;
  private height = 0;
  private gravity = false;
  private currentText = "";
  private pointer = { x: -1000, y: -1000, active: false };

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D rendering is unavailable");
    this.context = context;
    this.resize();
    window.addEventListener("resize", this.resize);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointerleave", this.onPointerUp);
    this.animate();
  }

  get particleCount() {
    return this.particles.length;
  }

  setGravity(enabled: boolean) {
    this.gravity = enabled;
  }

  updateTargets(text: string, scatter: boolean) {
    this.currentText = text;
    const targets = this.sampleText(text);

    while (this.particles.length < targets.length) {
      const target = targets[this.particles.length];
      this.particles.push({
        x: scatter ? Math.random() * this.width : target.x,
        y: scatter ? Math.random() * this.height : target.y,
        vx: 0,
        vy: 0,
        targetX: target.x,
        targetY: target.y,
        color: COLORS[this.particles.length % COLORS.length],
        radius: Math.random() * 1.7 + 0.8,
      });
    }

    this.particles.length = targets.length;
    this.particles.forEach((particle, index) => {
      particle.targetX = targets[index].x;
      particle.targetY = targets[index].y;
      if (scatter) {
        particle.vx += (Math.random() - 0.5) * 45;
        particle.vy += (Math.random() - 0.5) * 45;
      }
    });
  }

  randomize() {
    this.particles.forEach((particle) => {
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 55 + 20;
      particle.vx += Math.cos(angle) * force;
      particle.vy += Math.sin(angle) * force;
    });
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    window.removeEventListener("resize", this.resize);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointerleave", this.onPointerUp);
  }

  private resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * ratio;
    this.canvas.height = this.height * ratio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (this.currentText) this.updateTargets(this.currentText, false);
  };

  private sampleText(text: string) {
    const sampleCanvas = document.createElement("canvas");
    const context = sampleCanvas.getContext("2d");
    if (!context) return [];

    sampleCanvas.width = this.width;
    sampleCanvas.height = this.height;
    const fontSize = Math.min(this.width * (text.length > 1 ? 0.42 : 0.58), this.height * 0.62);
    context.fillStyle = "#fff";
    context.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, this.width / 2, this.height / 2);

    const pixels = context.getImageData(0, 0, this.width, this.height).data;
    const spacing = this.width < 640 ? 7 : 6;
    const targets: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < this.height; y += spacing) {
      for (let x = 0; x < this.width; x += spacing) {
        if (pixels[(y * this.width + x) * 4 + 3] > 128) targets.push({ x, y });
      }
    }
    return targets;
  }

  private onPointerMove = (event: PointerEvent) => {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
  };

  private onPointerDown = (event: PointerEvent) => {
    this.pointer.active = true;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.canvas.setPointerCapture(event.pointerId);
    eventHorizonAudio.playDrone();
  };

  private onPointerUp = () => {
    if (this.pointer.active) this.randomize();
    this.pointer.active = false;
    eventHorizonAudio.stopDrone();
  };

  private animate = () => {
    this.context.fillStyle = "rgba(2, 3, 8, 0.2)";
    this.context.fillRect(0, 0, this.width, this.height);

    for (const particle of this.particles) {
      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;
      particle.vx += dx * 0.018;
      particle.vy += dy * 0.018;

      const pointerDx = particle.x - this.pointer.x;
      const pointerDy = particle.y - this.pointer.y;
      const distanceSquared = pointerDx * pointerDx + pointerDy * pointerDy;
      if (distanceSquared < 18000 && distanceSquared > 0) {
        const distance = Math.sqrt(distanceSquared);
        const force = (1 - distance / 135) * (this.pointer.active ? -2.2 : 1.2);
        particle.vx += (pointerDx / distance) * force;
        particle.vy += (pointerDy / distance) * force;
      }

      if (this.gravity) particle.vy += 0.12;
      particle.vx *= 0.88;
      particle.vy *= 0.88;
      particle.x += particle.vx;
      particle.y += particle.vy;

      this.context.beginPath();
      this.context.fillStyle = particle.color;
      this.context.globalAlpha = 0.82;
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.context.fill();
    }

    this.context.globalAlpha = 1;
    this.frame = requestAnimationFrame(this.animate);
  };
}
