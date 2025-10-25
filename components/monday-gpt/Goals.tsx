// components/monday-gpt/Goals.tsx

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Types for Goal
interface Goal {
  id: number;
  item: string;
  cost: number;
  earned: number;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [earned, setEarned] = useState("");

  const loadGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("Error loading goals:", (err as Error).message);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async () => {
    if (!item || !cost) return alert("Fill item + cost");
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, cost: parseFloat(cost) }),
      });
      setItem("");
      setCost("");
      loadGoals();
    } catch (err) {
      console.error("Error adding goal:", (err as Error).message);
    }
  };

  const updateEarned = async (id: number, newEarnedStr: string) => {
    const newEarned = parseFloat(newEarnedStr);
    if (isNaN(newEarned)) return alert("Please enter a valid number");
    
    try {
      await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ earned: newEarned }),
      });

      // Check if goal is complete
      const goal = goals.find(g => g.id === id);
      if (goal && newEarned >= goal.cost) {
        // Fetch the sarcastic reward
        const res = await fetch("/api/goal-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: goal.item }),
        });
        const data = await res.json();
        toast.success(data.message, { theme: "dark" });
      }

      setEarned(""); // Clear input after update
      loadGoals();
    } catch (err) {
      console.error("Error updating goal:", (err as Error).message);
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });
      loadGoals();
    } catch (err) {
      console.error("Error deleting goal:", (err as Error).message);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "600px",
        marginTop: "1rem",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>🎯 Weekly Goals</h3>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          placeholder="Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          style={{
            flex: "1",
            background: "#111",
            color: "#e2e2e2",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "6px",
          }}
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          style={{
            width: "80px",
            background: "#111",
            color: "#e2e2e2",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "6px",
          }}
        />
        <button
          onClick={addGoal}
          style={{
            background: "linear-gradient(90deg, #00ffcc, #0099ff)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            color: "#0d0d0d",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {goals.length === 0 && <p style={{ opacity: 0.6 }}>No goals yet — set some missions.</p>}

      {goals.map((g) => {
        const percent = Math.min((g.earned / g.cost) * 100, 100);
        const done = g.earned >= g.cost;
        return (
          <div
            key={g.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderLeft: done ? "4px solid #00ff99" : "4px solid #ffcc00",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "8px",
              transition: "transform 0.1s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{g.item}</strong>
              <span>${g.earned.toFixed(2)} / ${g.cost.toFixed(2)}</span>
            </div>

            <div
              style={{
                height: "10px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
                marginTop: "6px",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  background: done
                    ? "linear-gradient(90deg, #00ff99, #00ccff)"
                    : "linear-gradient(90deg, #ffcc00, #ff9966)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
            
            {/* This is an inner form for updating a specific goal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Find the input value associated with this form
                const input = (e.target as HTMLFormElement).elements.namedItem(`earned-${g.id}`) as HTMLInputElement;
                if (input) {
                  updateEarned(g.id, input.value);
                  input.value = ""; // Clear this specific input
                }
              }}
              style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}
            >
              <input
                type="number"
                name={`earned-${g.id}`} // Unique name
                placeholder="Add/Set Earned"
                step="0.01"
                style={{
                  flex: "1",
                  background: "#111",
                  color: "#e2e2e2",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(90deg, #00ffcc, #0099ff)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  color: "#0d0d0d",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => deleteGoal(g.id)}
                style={{
                  background: "transparent",
                  border: "1px solid tomato",
                  color: "tomato",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}