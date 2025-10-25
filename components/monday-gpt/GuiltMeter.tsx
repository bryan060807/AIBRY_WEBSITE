// components/monday-gpt/GuiltMeter.tsx

import React from "react";

interface GuiltMeterProps {
  avg: number;
}

const GuiltMeter: React.FC<GuiltMeterProps> = ({ avg }) => {
  const color =
    avg < 2 ? "linear-gradient(90deg, #00ff99, #00ccff)" :
    avg < 4 ? "linear-gradient(90deg, #ffcc00, #ff9966)" :
    "linear-gradient(90deg, #ff0033, #ff6600)";

  return (
    <div
      style={{
        height: "1.2rem",
        borderRadius: "1rem",
        background: "rgba(255,255,255,0.1)",
        overflow: "hidden",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          width: `${(avg / 5) * 100}%`,
          background: color,
          height: "100%",
          transition: "width 0.4s ease",
          boxShadow: "0 0 8px rgba(255, 0, 100, 0.4)",
        }}
      />
    </div>
  );
};

export default GuiltMeter;