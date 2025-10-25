// components/monday-gpt/ProgressBar.tsx

import React from "react";

interface ProgressBarProps {
  total: number;
  goal: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, goal }) => {
  const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

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
          width: `${percent}%`,
          background:
            percent < 70
              ? "linear-gradient(90deg, #00ff99, #00ccff)"
              : percent < 100
              ? "linear-gradient(90deg, #ffcc00, #ff9966)"
              : "linear-gradient(90deg, #ff0033, #ff6600)",
          height: "100%",
          transition: "width 0.4s ease",
          boxShadow: "0 0 8px rgba(0,255,200,0.6)",
        }}
      />
    </div>
  );
};

export default ProgressBar;