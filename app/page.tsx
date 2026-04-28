"use client";
import { useState, useEffect } from "react";

type Workout = {
  id: number;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
};

const EXERCISES = [
  { name: "Push-ups", type: "Strength", cal: 8 },
  { name: "Squats", type: "Strength", cal: 10 },
  { name: "Running", type: "Cardio", cal: 12 },
  { name: "Cycling", type: "Cardio", cal: 10 },
  { name: "Plank", type: "Core", cal: 5 },
  { name: "Pull-ups", type: "Strength", cal: 9 },
  { name: "Jump Rope", type: "Cardio", cal: 15 },
  { name: "Yoga", type: "Flexibility", cal: 4 },
  { name: "Deadlift", type: "Strength", cal: 11 },
  { name: "HIIT", type: "Cardio", cal: 14 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVITY = [3, 5, 2, 6, 4, 7, 3];

export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, name: "Morning Run", type: "Cardio", duration: 30, calories: 360, date: "2026-04-27" },
    { id: 2, name: "Push-ups", type: "Strength", duration: 20, calories: 160, date: "2026-04-26" },
    { id: 3, name: "HIIT Session", type: "Cardio", duration: 25, calories: 350, date: "2026-04-25" },
  ]);
  const [form, setForm] = useState({ name: "", type: "Strength", duration: "", exercise: "Push-ups" });
  const [bmi, setBmi] = useState({ weight: "", height: "", result: "" });
  const [streak, setStreak] = useState(7);
  const [goal, setGoal] = useState(500);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const todayCalories = workouts
    .filter(w => w.date === "2026-04-28")
    .reduce((a, b) => a + b.calories, 0);

  const weekCalories = workouts.reduce((a, b) => a + b.calories, 0);

  const addWorkout = () => {
    if (!form.duration) return;
    const ex = EXERCISES.find(e => e.name === form.exercise) || EXERCISES[0];
    const cal = Math.round(parseInt(form.duration) * ex.cal);
    setWorkouts(prev => [{
      id: Date.now(),
      name: form.name || form.exercise,
      type: form.type,
      duration: parseInt(form.duration),
      calories: cal,
      date: "2026-04-28"
    }, ...prev]);
    setForm({ name: "", type: "Strength", duration: "", exercise: "Push-ups" });
  };

  const calcBmi = () => {
    const w = parseFloat(bmi.weight);
    const h = parseFloat(bmi.height) / 100;
    if (!w || !h) return;
    const val = (w / (h * h)).toFixed(1);
    let label = "";
    const v = parseFloat(val);
    if (v < 18.5) label = "Underweight";
    else if (v < 25) label = "✅ Normal";
    else if (v < 30) label = "⚠️ Overweight";
    else label = "🔴 Obese";
    setBmi(prev => ({ ...prev, result: `${val} — ${label}` }));
  };

  const typeColor = (type: string) => {
    const map: Record<string, string> = {
      Cardio: "#ff4d4d", Strength: "#ff8c00", Core: "#00f5a0", Flexibility: "#7c3aed"
    };
    return map[type] || "#6b6b80";
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* NAV */}
      <nav className="nav">
        <div className="logo">FITNESSE PRO</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["dashboard", "workouts", "add", "bmi"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "8px 18px", borderRadius: 50, border: "none",
                background: tab === t ? "linear-gradient(135deg,#ff4d4d,#ff8c00)" : "rgba(255,255,255,0.05)",
                color: tab === t ? "white" : "#6b6b80",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                textTransform: "capitalize", transition: "all 0.2s"
              }}>
              {t === "add" ? "+ Add" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ paddingTop: 90, paddingBottom: 60 }}>
        {/* ====== DASHBOARD ====== */}
        {tab === "dashboard" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            {/* Hero */}
            <div className="hero-grid" style={{
              borderRadius: 24, padding: "60px 48px", marginBottom: 32,
              background: "linear-gradient(135deg, #12121a 0%, #1a0a0f 100%)",
              border: "1px solid rgba(255,77,77,0.15)",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", right: -60, top: -60,
                width: 300, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,77,77,0.15) 0%, transparent 70%)"
              }} />
              <div className="tag tag-fire" style={{ marginBottom: 16 }}>🔥 Day {streak} Streak</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, letterSpacing: 3, lineHeight: 1, marginBottom: 12 }}>
                <span className="glow-text">CRUSH</span> YOUR<br />LIMITS TODAY
              </h1>
              <p style={{ color: "#6b6b80", fontSize: 16, marginBottom: 28 }}>
                Every rep counts. Track it, own it, destroy it.
              </p>
              <button className="btn-primary" onClick={() => setTab("add")}>
                + LOG WORKOUT
              </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Today's Calories", value: todayCalories || 0, unit: "kcal", icon: "🔥" },
                { label: "This Week", value: weekCalories, unit: "kcal", icon: "📈" },
                { label: "Workouts", value: workouts.length, unit: "total", icon: "💪" },
                { label: "Streak", value: streak, unit: "days", icon: "⚡" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: "24px 20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="stat-number" style={{ fontSize: 36 }}>{s.value}</div>
                  <div style={{ color: "#6b6b80", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                    {s.unit}
                  </div>
                  <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Weekly Chart + Goal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {/* Weekly Activity */}
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 24, fontSize: 15 }}>Weekly Activity</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 100 }}>
                  {DAYS.map((d, i) => (
                    <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: "100%", height: `${ACTIVITY[i] * 14}px`,
                        background: i === 6 ? "linear-gradient(180deg,#ff4d4d,#ff8c00)" : "rgba(255,77,77,0.2)",
                        borderRadius: "4px 4px 0 0", transition: "height 0.5s ease"
                      }} />
                      <div style={{ color: "#6b6b80", fontSize: 11 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goal */}
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Weekly Goal</div>
                <div style={{ color: "#6b6b80", fontSize: 13, marginBottom: 24 }}>
                  {weekCalories} / {goal * 7} kcal target
                </div>
                <div className="progress-bar" style={{ marginBottom: 20, height: 10 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(100, (weekCalories / (goal * 7)) * 100)}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b6b80" }}>
                  <span>0 kcal</span>
                  <span style={{ color: "#ff4d4d", fontWeight: 700 }}>
                    {Math.round((weekCalories / (goal * 7)) * 100)}%
                  </span>
                  <span>{goal * 7} kcal</span>
                </div>
                <div style={{ marginTop: 20 }}>
                  <label style={{ fontSize: 12, color: "#6b6b80", marginBottom: 8, display: "block" }}>
                    Daily Goal (kcal)
                  </label>
                  <input type="number" value={goal}
                    onChange={e => setGoal(parseInt(e.target.value) || 500)}
                    style={{ maxWidth: 120 }} />
                </div>
              </div>
            </div>

            {/* Recent Workouts */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Workouts</div>
                <button className="btn-ghost" onClick={() => setTab("workouts")} style={{ fontSize: 12, padding: "6px 16px" }}>
                  View All
                </button>
              </div>
              {workouts.slice(0, 3).map(w => (
                <div key={w.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${typeColor(w.type)}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20
                    }}>
                      {w.type === "Cardio" ? "🏃" : w.type === "Strength" ? "🏋️" : w.type === "Core" ? "🎯" : "🧘"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div>
                      <div style={{ color: "#6b6b80", fontSize: 12 }}>{w.date} • {w.duration} min</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: typeColor(w.type), fontWeight: 700, fontSize: 16 }}>{w.calories}</div>
                    <div style={{ color: "#6b6b80", fontSize: 11 }}>kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== WORKOUTS ====== */}
        {tab === "workouts" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}>
              <div className="tag tag-fire" style={{ marginBottom: 12 }}>YOUR HISTORY</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2 }}>
                ALL WORKOUTS
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workouts.map((w, i) => (
                <div key={w.id} className="card" style={{
                  padding: "20px 24px", display: "flex",
                  alignItems: "center", justifyContent: "space-between",
                  animation: `fadeInUp 0.4s ease ${i * 0.05}s both`
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: `${typeColor(w.type)}20`,
                      border: `1px solid ${typeColor(w.type)}40`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24
                    }}>
                      {w.type === "Cardio" ? "🏃" : w.type === "Strength" ? "🏋️" : w.type === "Core" ? "🎯" : "🧘"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{w.name}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="tag" style={{ background: `${typeColor(w.type)}15`, color: typeColor(w.type) }}>
                          {w.type}
                        </span>
                        <span style={{ color: "#6b6b80", fontSize: 12 }}>📅 {w.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 32, textAlign: "right" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#ff8c00", fontSize: 18 }}>{w.duration}</div>
                      <div style={{ color: "#6b6b80", fontSize: 11 }}>minutes</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#ff4d4d", fontSize: 18 }}>{w.calories}</div>
                      <div style={{ color: "#6b6b80", fontSize: 11 }}>kcal</div>
                    </div>
                    <button onClick={() => setWorkouts(prev => prev.filter(x => x.id !== w.id))}
                      style={{ background: "rgba(255,77,77,0.1)", border: "none", color: "#ff4d4d",
                        width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {workouts.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#6b6b80" }}>
                  No workouts yet. <button className="btn-primary" onClick={() => setTab("add")}>Add one!</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== ADD WORKOUT ====== */}
        {tab === "add" && (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}>
              <div className="tag tag-neon" style={{ marginBottom: 12 }}>NEW SESSION</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2 }}>
                LOG WORKOUT
              </h2>
            </div>
            <div className="card" style={{ padding: 36 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Exercise
                  </label>
                  <select value={form.exercise}
                    onChange={e => setForm(p => ({ ...p, exercise: e.target.value, type: EXERCISES.find(ex => ex.name === e.target.value)?.type || "Strength" }))}>
                    {EXERCISES.map(e => <option key={e.name}>{e.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Custom Name (optional)
                  </label>
                  <input placeholder="e.g. Morning Run" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Duration (minutes)
                  </label>
                  <input type="number" placeholder="e.g. 30" value={form.duration}
                    onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
                </div>

                {/* Preview */}
                {form.duration && (
                  <div style={{
                    padding: 20, borderRadius: 12, background: "rgba(255,77,77,0.05)",
                    border: "1px solid rgba(255,77,77,0.2)"
                  }}>
                    <div style={{ fontSize: 12, color: "#6b6b80", marginBottom: 8 }}>ESTIMATED BURN</div>
                    <div className="stat-number" style={{ fontSize: 40 }}>
                      {Math.round(parseInt(form.duration || "0") * (EXERCISES.find(e => e.name === form.exercise)?.cal || 8))}
                    </div>
                    <div style={{ color: "#ff4d4d", fontSize: 14 }}>calories</div>
                  </div>
                )}

                <button className="btn-primary" onClick={addWorkout} style={{ width: "100%", padding: 16, fontSize: 15, borderRadius: 12 }}>
                  ⚡ LOG WORKOUT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====== BMI ====== */}
        {tab === "bmi" && (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}>
              <div className="tag tag-gold" style={{ marginBottom: 12 }}>HEALTH CHECK</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2 }}>
                BMI CALCULATOR
              </h2>
            </div>
            <div className="card" style={{ padding: 36 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Weight (kg)
                  </label>
                  <input type="number" placeholder="70" value={bmi.weight}
                    onChange={e => setBmi(p => ({ ...p, weight: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Height (cm)
                  </label>
                  <input type="number" placeholder="175" value={bmi.height}
                    onChange={e => setBmi(p => ({ ...p, height: e.target.value }))} />
                </div>
                <button className="btn-primary" onClick={calcBmi} style={{ width: "100%", padding: 16, fontSize: 15, borderRadius: 12 }}>
                  CALCULATE BMI
                </button>
                {bmi.result && (
                  <div style={{
                    textAlign: "center", padding: 28, borderRadius: 16,
                    background: "rgba(255,140,0,0.05)", border: "1px solid rgba(255,140,0,0.2)"
                  }}>
                    <div style={{ color: "#6b6b80", fontSize: 12, marginBottom: 8 }}>YOUR BMI</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, background: "linear-gradient(135deg,#ff4d4d,#ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {bmi.result.split("—")[0]}
                    </div>
                    <div style={{ color: "#ff8c00", fontWeight: 700, marginTop: 8 }}>
                      {bmi.result.split("—")[1]}
                    </div>
                  </div>
                )}
                {/* BMI Scale */}
                <div style={{ marginTop: 8 }}>
                  {[
                    { label: "Underweight", range: "< 18.5", color: "#60a5fa" },
                    { label: "Normal", range: "18.5 – 24.9", color: "#00f5a0" },
                    { label: "Overweight", range: "25 – 29.9", color: "#ff8c00" },
                    { label: "Obese", range: "> 30", color: "#ff4d4d" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                        <span style={{ fontSize: 14 }}>{r.label}</span>
                      </div>
                      <span style={{ color: r.color, fontSize: 13, fontWeight: 600 }}>{r.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", color: "#333", fontSize: 12 }}>
        FITNESSE PRO v2.0 — Built with 💪 by SSD
      </div>
    </div>
  );
}
