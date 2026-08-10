"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleEngine } from "./ParticleEngine";
import { eventHorizonAudio } from "./audio";

export default function EventHorizon() {
  const [number, setNumber] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);
  const firstRender = useRef(true);

  const nextStep = useCallback(() => {
    setNumber((current) => (current > 1 ? current - 1 : 10));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((enabled) => {
      eventHorizonAudio.setEnabled(!enabled);
      return !enabled;
    });
  }, []);

  const toggleGravity = useCallback(() => {
    setGravityEnabled((enabled) => !enabled);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new ParticleEngine(canvasRef.current);
    engine.updateTargets("10", false);
    engineRef.current = engine;

    const particleCounter = window.setInterval(() => {
      setParticleCount(engine.particleCount);
    }, 150);

    return () => {
      window.clearInterval(particleCounter);
      engine.destroy();
      engineRef.current = null;
      eventHorizonAudio.stop();
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setGravity(gravityEnabled);
  }, [gravityEnabled]);

  useEffect(() => {
    if (!isPlaying) return;
    const countdown = window.setInterval(nextStep, 5000);
    return () => window.clearInterval(countdown);
  }, [isPlaying, nextStep]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    engineRef.current?.updateTargets(String(number), true);
    eventHorizonAudio.playTransition();
  }, [number]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          setIsPlaying((playing) => !playing);
          break;
        case "arrowright":
          event.preventDefault();
          nextStep();
          break;
        case "r":
          engineRef.current?.randomize();
          eventHorizonAudio.playImpact();
          break;
        case "s":
          toggleSound();
          break;
        case "g":
          toggleGravity();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, toggleGravity, toggleSound]);

  return (
    <section className="fixed inset-0 z-[100] overflow-hidden bg-[#020308] text-slate-100 selection:bg-blue-500/30">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[38rem] w-[38rem] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[32rem] w-[32rem] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="event-horizon-grid absolute inset-0 opacity-70" />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-none"
        aria-label={`Interactive particle countdown displaying ${number}`}
      />

      <header className="pointer-events-none absolute left-5 right-5 top-5 z-10 flex items-center justify-between md:left-10 md:right-10 md:top-8">
        <div className="flex items-center gap-4">
          <div className="flex gap-1" aria-hidden>
            {["#4285F4", "#EA4335", "#FBBC05", "#34A853"].map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="h-4 w-px bg-slate-700" />
          <span className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:inline">
            Event Horizon
          </span>
        </div>
        <Link
          href="/"
          className="pointer-events-auto rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest !text-slate-300 backdrop-blur-md transition hover:border-white/25 hover:!text-white hover:no-underline"
        >
          Exit
        </Link>
      </header>

      <aside className="pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-8 lg:flex">
        <Stat label="Current sequence" value={String(number).padStart(2, "0")} />
        <Stat label="Particle count" value={particleCount.toLocaleString()} accent />
        <Stat label="Physics engine" value="Spring-V3" />
      </aside>

      <footer className="absolute bottom-5 left-1/2 z-10 w-[calc(100%-2rem)] max-w-[700px] -translate-x-1/2 md:bottom-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-xl sm:flex-row md:p-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying((playing) => !playing)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:scale-105"
              aria-label={isPlaying ? "Pause countdown" : "Play countdown"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type="button" onClick={nextStep} className="event-horizon-button">
              Next step
            </button>
            <button
              type="button"
              onClick={() => {
                engineRef.current?.randomize();
                eventHorizonAudio.playImpact();
              }}
              className="event-horizon-button hidden min-[420px]:block"
            >
              Randomize
            </button>
          </div>

          <div className="flex items-center gap-6">
            <Toggle label="Gravity" enabled={gravityEnabled} onClick={toggleGravity} />
            <Toggle label="Audio" enabled={soundEnabled} onClick={toggleSound} />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-4 text-[10px] uppercase tracking-wider text-slate-500 sm:mt-6 sm:gap-6">
          <Shortcut keyName="Space" label="Play / pause" />
          <Shortcut keyName="G" label="Gravity" />
          <Shortcut keyName="Mouse" label="Interact" />
        </div>
      </footer>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-green-500 opacity-40" />
    </section>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-sm font-medium ${accent ? "font-mono text-blue-400" : "text-slate-200"}`}>{value}</p>
    </div>
  );
}

function Toggle({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1" aria-pressed={enabled}>
      <span className={`relative h-6 w-10 rounded-full ${enabled ? "bg-blue-600" : "bg-slate-700"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${enabled ? "right-1 bg-white" : "left-1 bg-slate-400"}`} />
      </span>
      <span className="text-[9px] uppercase tracking-tight text-slate-500">{label}</span>
    </button>
  );
}

function Shortcut({ keyName, label }: { keyName: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <kbd className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-slate-400">{keyName}</kbd>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function PlayIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>;
}

function PauseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>;
}
