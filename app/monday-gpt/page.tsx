// app/monday-gpt/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "@/components/monday-gpt/ProgressBar";
import GuiltMeter from "@/components/monday-gpt/GuiltMeter";
import Goals from "@/components/monday-gpt/Goals";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/monday-gpt.css"; // We will create this file

// Define types for our data
interface Expense {
  id: number;
  amount: number;
  category: string;
  guilt: number;
  note: string;
}

export default function MondayGptPage() {
  const [booting, setBooting] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [guilt, setGuilt] = useState(3);
  const [note, setNote] = useState("");
  const [roast, setRoast] = useState("");
  const [weeklyGuilt, setWeeklyGuilt] = useState(0);
  const [weeklyWarning, setWeeklyWarning] = useState<string | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState(500);

  const guiltThreshold = 20;

  // --- Data Fetching ---
  // All API calls now go to our Next.js API routes

  const loadExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", (err as Error).message);
    }
  };

  const loadWeeklyGuilt = async () => {
    try {
      const res = await fetch("/api/weekly-warning");
      if (!res.ok) throw new Error("Failed to fetch weekly warning");
      const data = await res.json();
      
      setWeeklyGuilt(data.weeklyGuilt);
      setWeeklyWarning(data.warning || null);

      if (data.warning) {
        toast.error(data.warning, {
          position: "top-center",
          autoClose: 7000,
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Error fetching weekly guilt:", (err as Error).message);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadWeeklyGuilt();
  }, []);

  // Fake boot sequence from your original App.js 
  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const addExpense = async () => {
    if (!amount || !category) return alert("Please enter amount and category");
    
    const newExpense = {
      amount: parseFloat(amount),
      category,
      guilt: parseInt(guilt.toString()),
      note,
    };

    try {
      // 1. Add the expense
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      // 2. Get a roast for it
      const roastRes = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      const roastData = await roastRes.json();
      setRoast(roastData.roast);

      // 3. Reload all data
      await loadExpenses();
      await loadWeeklyGuilt();
      
      // 4. Reset form
      setAmount("");
      setCategory("");
      setGuilt(3);
      setNote("");
    } catch (err) {
      console.error("Error adding expense:", (err as Error).message);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      await loadExpenses();
      await loadWeeklyGuilt();
    } catch (err) {
      console.error("Error deleting expense:", (err as Error).message);
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgGuilt = expenses.length
    ? expenses.reduce((sum, e) => sum + e.guilt, 0) / expenses.length
    : 0;

  // Dynamic background color from App.js 
  const bgColor =
    weeklyGuilt < 10 ? "#0d0d0d" :
    weeklyGuilt < 20 ? "#1a0d0d" :
    "#330000";

  // Boot overlay
  const username = "AIBRY";
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (booting) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at top, #000, #050505)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#00ffcc",
          fontFamily: "JetBrains Mono, monospace",
          zIndex: 9999,
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          INITIALIZING // MONDAY 2.0 GPT
        </h1>
        <p className="typing">loading systems . . .</p>
        <p style={{ marginTop: "1rem", opacity: 0.7 }}>
          User {username} logged in at {now}
        </p>
      </div>
    );
  }

  // Dashboard
  return (
    <div
      className="fadeInUp"
      style={{
        minHeight: "100vh",
        background: bgColor,
        color: "#e2e2e2",
        fontFamily: "JetBrains Mono, monospace",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        transition: "background 0.5s ease",
      }}
    >
      <h1>💸 Monday 2.0 GPT</h1>
      <h3 style={{ opacity: 0.7 }}>Short-term budgeting with attitude</h3>

      {/* Weekly Goal */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <label style={{ marginRight: 10 }}>Weekly Goal:</label>
        <input
          type="number"
          value={weeklyGoal}
          onChange={(e) => setWeeklyGoal(parseFloat(e.target.value))}
          style={{
            width: 100,
            padding: "6px",
            background: "#111",
            color: "#e2e2e2",
            border: "1px solid #333",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* Add Expense Form */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          justifyContent: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: 100,
            background: "#111",
            border: "1px solid #333",
            borderRadius: "6px",
            color: "#e2e2e2",
            padding: "6px",
          }}
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: 100,
            background: "#111",
            border: "1px solid #333",
            borderRadius: "6px",
            color: "#e2e2e2",
            padding: "6px",
          }}
        />
        <select
          value={guilt}
          onChange={(e) => setGuilt(parseInt(e.target.value))}
          style={{
            background: "#111",
            border: "1px solid #333",
            borderRadius: "6px",
            color: "#e2e2e2",
            padding: "6px",
          }}
        >
          <option value={1}>1 - Calm</option>
          <option value={2}>2 - Mild Concern</option>
          <option value={3}>3 - Stressed</option>
          <option value={4}>4 - High Stress</option>
          <option value={5}>5 - Meltdown</option>
        </select>
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: 120,
            background: "#111",
            border: "1px solid #333",
            borderRadius: "6px",
            color: "#e2e2e2",
            padding: "6px",
          }}
        />
        <button
          onClick={addExpense}
          style={{
            background: "linear-gradient(90deg, #00ffcc, #0099ff)",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            color: "#0d0d0d",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          Add Expense
        </button>
      </div>

      {/* AI Roast */}
      {roast && (
        <p
          style={{
            color: "#ff6666",
            fontStyle: "italic",
            animation: "fadeIn 0.8s ease-in",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          {roast}
        </p>
      )}

      {/* Progress Bars */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h4 style={{ marginBottom: "0.5rem" }}>Weekly Budget Progress</h4>
        <ProgressBar total={total} goal={weeklyGoal} />
        <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
          Emotional Stability
        </h4>
        <GuiltMeter avg={avgGuilt} />
      </div>

      {/* Weekly Guilt Meter */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1rem",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            background: "#333",
            borderRadius: 10,
            height: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min((weeklyGuilt / guiltThreshold) * 100, 100)}%`,
              height: "100%",
              background:
                weeklyGuilt < guiltThreshold * 0.5
                  ? "limegreen"
                  : weeklyGuilt < guiltThreshold * 0.9
                  ? "gold"
                  : "tomato",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <p style={{ marginTop: "0.5rem" }}>
          {weeklyWarning
            ? weeklyWarning
            : `Guilt: ${weeklyGuilt}/${guiltThreshold}`}
        </p>
      </div>

      {/* Expense History */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>Expense History</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {expenses.map((e) => (
            <li
              key={e.id}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderLeft: `4px solid ${
                  e.guilt >= 4
                    ? "#ff4d4d"
                    : e.guilt >= 3
                    ? "#ffcc00"
                    : "#66ff99"
                }`,
                padding: "10px 15px",
                borderRadius: "10px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "transform 0.1s ease",
              }}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.transform = "scale(1.01)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.transform = "scale(1.0)")
              }
            >
              <span>
                ${e.amount.toFixed(2)} — {e.category} ({e.guilt}/5 guilt)
                {e.note && ` - ${e.note}`}
              </span>
              <button
                onClick={() => deleteExpense(e.id)}
                style={{
                  background: "transparent",
                  border: "1px solid tomato",
                  color: "tomato",
                  cursor: "pointer",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Goals Component */}
      <Goals />
      <ToastContainer />
    </div>
  );
}