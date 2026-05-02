"use client";
import { useState, useEffect } from "react";

type Workout = {
  id: number; name: string; type: string; duration: number; calories: number; date: string;
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

const PLANS = [
  { id: "basic", name: "Basic", price: 99, color: "#6b6b80", popular: false, features: ["5 Workouts/day", "Basic Analytics", "BMI Calculator", "Email Support"] },
  { id: "pro", name: "Pro", price: 299, color: "#ff4d4d", popular: true, features: ["Unlimited Workouts", "Advanced Analytics", "AI Coach", "Priority Support", "Custom Goals", "Diet Planner"] },
  { id: "elite", name: "Elite", price: 599, color: "#ff8c00", popular: false, features: ["Everything in Pro", "1-on-1 Trainer", "Live Sessions", "Nutrition Plan", "Body Scan AI", "24/7 Support"] },
];

declare global { interface Window { Razorpay: any; } }

export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, name: "Morning Run", type: "Cardio", duration: 30, calories: 360, date: "2026-04-27" },
    { id: 2, name: "Push-ups", type: "Strength", duration: 20, calories: 160, date: "2026-04-26" },
    { id: 3, name: "HIIT Session", type: "Cardio", duration: 25, calories: 350, date: "2026-04-25" },
  ]);
  const [form, setForm] = useState({ name: "", type: "Strength", duration: "", exercise: "Push-ups" });
  const [bmi, setBmi] = useState({ weight: "", height: "", result: "" });
  const [goal, setGoal] = useState(500);
  const [mounted, setMounted] = useState(false);
  const [payStatus, setPayStatus] = useState<Record<string, string>>({});
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setRzpLoaded(true);
    document.body.appendChild(s);
  }, []);

  const handlePayment = (plan: typeof PLANS[0]) => {
    if (!rzpLoaded) { alert("Payment gateway loading..."); return; }
    setPayStatus(p => ({ ...p, [plan.id]: "processing" }));
    const rzp = new window.Razorpay({
      key: "rzp_test_YourKeyHere",
      amount: plan.price * 100,
      currency: "INR",
      name: "FitnessePro",
      description: `${plan.name} Plan — Monthly`,
      theme: { color: plan.color },
      handler: (res: any) => {
        setPayStatus(p => ({ ...p, [plan.id]: "success" }));
        setActivePlan(plan.id);
        alert(`✅ Payment Successful!\nID: ${res.razorpay_payment_id}\n${plan.name} Plan Activated!`);
      },
      modal: { ondismiss: () => setPayStatus(p => ({ ...p, [plan.id]: "" })) },
    });
    rzp.on("payment.failed", (r: any) => {
      setPayStatus(p => ({ ...p, [plan.id]: "failed" }));
      alert(`❌ Payment Failed: ${r.error.description}`);
    });
    rzp.open();
  };

  const todayCal = workouts.filter(w => w.date === "2026-04-28").reduce((a, b) => a + b.calories, 0);
  const weekCal = workouts.reduce((a, b) => a + b.calories, 0);

  const addWorkout = () => {
    if (!form.duration) return;
    const ex = EXERCISES.find(e => e.name === form.exercise) || EXERCISES[0];
    setWorkouts(p => [{ id: Date.now(), name: form.name || form.exercise, type: form.type, duration: parseInt(form.duration), calories: Math.round(parseInt(form.duration) * ex.cal), date: "2026-04-28" }, ...p]);
    setForm({ name: "", type: "Strength", duration: "", exercise: "Push-ups" });
  };

  const calcBmi = () => {
    const w = parseFloat(bmi.weight), h = parseFloat(bmi.height) / 100;
    if (!w || !h) return;
    const v = parseFloat((w / (h * h)).toFixed(1));
    const label = v < 18.5 ? "Underweight" : v < 25 ? "✅ Normal" : v < 30 ? "⚠️ Overweight" : "🔴 Obese";
    setBmi(p => ({ ...p, result: `${v} — ${label}` }));
  };

  const tc = (t: string) => ({ Cardio: "#ff4d4d", Strength: "#ff8c00", Core: "#00f5a0", Flexibility: "#7c3aed" }[t] || "#6b6b80");

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <nav className="nav">
        <div className="logo">FITNESSE PRO</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["dashboard", "workouts", "add", "bmi", "plans"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 50, border: "none",
              background: tab === t ? "linear-gradient(135deg,#ff4d4d,#ff8c00)" : "rgba(255,255,255,0.05)",
              color: tab === t ? "white" : "#6b6b80", cursor: "pointer", fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize", transition: "all 0.2s", position: "relative"
            } as React.CSSProperties}>
              {t === "add" ? "+ Add" : t === "plans" ? "💎 Plans" : t.charAt(0).toUpperCase() + t.slice(1)}
              {activePlan && t === "plans" && <span style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: "#00f5a0", border: "2px solid #0a0a0f" }} />}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ paddingTop: 90, paddingBottom: 60 }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <div className="hero-grid" style={{ borderRadius: 24, padding: "60px 48px", marginBottom: 32, background: "linear-gradient(135deg,#12121a,#1a0a0f)", border: "1px solid rgba(255,77,77,0.15)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -60, top: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,77,77,0.15) 0%,transparent 70%)" }} />
              <div className="tag tag-fire" style={{ marginBottom: 16 }}>🔥 7 Day Streak</div>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: 3, lineHeight: 1, marginBottom: 12 }}>
                <span className="glow-text">CRUSH</span> YOUR<br />LIMITS TODAY
              </h1>
              <p style={{ color: "#6b6b80", fontSize: 16, marginBottom: 28 }}>Every rep counts. Track it, own it, destroy it.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary" onClick={() => setTab("add")}>+ LOG WORKOUT</button>
                <button className="btn-ghost" onClick={() => setTab("plans")} style={{ borderColor: "#ff8c00", color: "#ff8c00" }}>💎 Go Premium</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
              {[{ label: "Today Calories", value: todayCal || 0, unit: "kcal", icon: "🔥" }, { label: "This Week", value: weekCal, unit: "kcal", icon: "📈" }, { label: "Workouts", value: workouts.length, unit: "total", icon: "💪" }, { label: "Streak", value: 7, unit: "days", icon: "⚡" }].map((s, i) => (
                <div key={i} className="card" style={{ padding: "24px 20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="stat-number" style={{ fontSize: 36 }}>{s.value}</div>
                  <div style={{ color: "#6b6b80", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{s.unit}</div>
                  <div style={{ color: "#444", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 24, fontSize: 15 }}>Weekly Activity</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 100 }}>
                  {DAYS.map((d, i) => (
                    <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ width: "100%", height: `${ACTIVITY[i] * 14}px`, background: i === 6 ? "linear-gradient(180deg,#ff4d4d,#ff8c00)" : "rgba(255,77,77,0.2)", borderRadius: "4px 4px 0 0" }} />
                      <div style={{ color: "#6b6b80", fontSize: 11 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>Weekly Goal</div>
                <div style={{ color: "#6b6b80", fontSize: 13, marginBottom: 24 }}>{weekCal} / {goal * 7} kcal</div>
                <div className="progress-bar" style={{ marginBottom: 20, height: 10 }}><div className="progress-fill" style={{ width: `${Math.min(100, (weekCal / (goal * 7)) * 100)}%` }} /></div>
                <label style={{ fontSize: 12, color: "#6b6b80", marginBottom: 8, display: "block" }}>Daily Goal (kcal)</label>
                <input type="number" value={goal} onChange={e => setGoal(parseInt(e.target.value) || 500)} style={{ maxWidth: 120 }} />
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Workouts</div>
                <button className="btn-ghost" onClick={() => setTab("workouts")} style={{ fontSize: 12, padding: "6px 16px" }}>View All</button>
              </div>
              {workouts.slice(0, 3).map(w => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tc(w.type)}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {w.type === "Cardio" ? "🏃" : w.type === "Strength" ? "🏋️" : w.type === "Core" ? "🎯" : "🧘"}
                    </div>
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div><div style={{ color: "#6b6b80", fontSize: 12 }}>{w.date} • {w.duration} min</div></div>
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ color: tc(w.type), fontWeight: 700, fontSize: 16 }}>{w.calories}</div><div style={{ color: "#6b6b80", fontSize: 11 }}>kcal</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKOUTS */}
        {tab === "workouts" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}>
              <div className="tag tag-fire" style={{ marginBottom: 12 }}>YOUR HISTORY</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: 2 }}>ALL WORKOUTS</h2>
            </div>
            {workouts.map(w => (
              <div key={w.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${tc(w.type)}20`, border: `1px solid ${tc(w.type)}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                    {w.type === "Cardio" ? "🏃" : w.type === "Strength" ? "🏋️" : "🎯"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{w.name}</div>
                    <span className="tag" style={{ background: `${tc(w.type)}15`, color: tc(w.type) }}>{w.type}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 32, textAlign: "right" }}>
                  <div><div style={{ fontWeight: 700, color: "#ff8c00", fontSize: 18 }}>{w.duration}</div><div style={{ color: "#6b6b80", fontSize: 11 }}>min</div></div>
                  <div><div style={{ fontWeight: 700, color: "#ff4d4d", fontSize: 18 }}>{w.calories}</div><div style={{ color: "#6b6b80", fontSize: 11 }}>kcal</div></div>
                  <button onClick={() => setWorkouts(p => p.filter(x => x.id !== w.id))} style={{ background: "rgba(255,77,77,0.1)", border: "none", color: "#ff4d4d", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD */}
        {tab === "add" && (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}><div className="tag tag-neon" style={{ marginBottom: 12 }}>NEW SESSION</div><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: 2 }}>LOG WORKOUT</h2></div>
            <div className="card" style={{ padding: 36 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div><label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase" }}>Exercise</label>
                  <select value={form.exercise} onChange={e => setForm(p => ({ ...p, exercise: e.target.value, type: EXERCISES.find(ex => ex.name === e.target.value)?.type || "Strength" }))}>
                    {EXERCISES.map(e => <option key={e.name}>{e.name}</option>)}
                  </select></div>
                <div><label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase" }}>Custom Name</label><input placeholder="e.g. Morning Run" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase" }}>Duration (minutes)</label><input type="number" placeholder="30" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} /></div>
                {form.duration && <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,77,77,0.05)", border: "1px solid rgba(255,77,77,0.2)", textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#6b6b80", marginBottom: 8 }}>ESTIMATED BURN</div>
                  <div className="stat-number" style={{ fontSize: 40 }}>{Math.round(parseInt(form.duration) * (EXERCISES.find(e => e.name === form.exercise)?.cal || 8))}</div>
                  <div style={{ color: "#ff4d4d", fontSize: 14 }}>calories</div>
                </div>}
                <button className="btn-primary" onClick={addWorkout} style={{ width: "100%", padding: 16, fontSize: 15, borderRadius: 12 }}>⚡ LOG WORKOUT</button>
              </div>
            </div>
          </div>
        )}

        {/* BMI */}
        {tab === "bmi" && (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 32 }}><div className="tag tag-gold" style={{ marginBottom: 12 }}>HEALTH CHECK</div><h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: 2 }}>BMI CALCULATOR</h2></div>
            <div className="card" style={{ padding: 36 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div><label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase" }}>Weight (kg)</label><input type="number" placeholder="70" value={bmi.weight} onChange={e => setBmi(p => ({ ...p, weight: e.target.value }))} /></div>
                <div><label style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#6b6b80", fontWeight: 700, textTransform: "uppercase" }}>Height (cm)</label><input type="number" placeholder="175" value={bmi.height} onChange={e => setBmi(p => ({ ...p, height: e.target.value }))} /></div>
                <button className="btn-primary" onClick={calcBmi} style={{ width: "100%", padding: 16, fontSize: 15, borderRadius: 12 }}>CALCULATE BMI</button>
                {bmi.result && <div style={{ textAlign: "center", padding: 28, borderRadius: 16, background: "rgba(255,140,0,0.05)", border: "1px solid rgba(255,140,0,0.2)" }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, background: "linear-gradient(135deg,#ff4d4d,#ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{bmi.result.split("—")[0]}</div>
                  <div style={{ color: "#ff8c00", fontWeight: 700 }}>{bmi.result.split("—")[1]}</div>
                </div>}
              </div>
            </div>
          </div>
        )}

        {/* ====== PLANS / RAZORPAY ====== */}
        {tab === "plans" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="tag tag-gold" style={{ marginBottom: 16 }}>POWERED BY RAZORPAY</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: 3, lineHeight: 1, marginBottom: 12 }}>
                CHOOSE YOUR <span className="glow-text">PLAN</span>
              </h2>
              <p style={{ color: "#6b6b80", fontSize: 16 }}>Unlock your full potential. No hidden charges. Cancel anytime.</p>
              {activePlan && (
                <div style={{ marginTop: 16, padding: "10px 24px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.3)", borderRadius: 50, display: "inline-block" }}>
                  <span style={{ color: "#00f5a0", fontWeight: 700 }}>✅ Active: {PLANS.find(p => p.id === activePlan)?.name} Plan</span>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 48 }}>
              {PLANS.map(plan => (
                <div key={plan.id} style={{
                  background: activePlan === plan.id ? `${plan.color}10` : "#12121a",
                  border: `2px solid ${plan.popular || activePlan === plan.id ? plan.color : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 20, padding: 32, position: "relative",
                  transform: plan.popular ? "scale(1.04)" : "scale(1)",
                  boxShadow: plan.popular ? `0 20px 60px ${plan.color}30` : "none",
                  transition: "all 0.3s"
                }}>
                  {plan.popular && (
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#ff4d4d,#ff8c00)", padding: "4px 20px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  {activePlan === plan.id && (
                    <div style={{ position: "absolute", top: -14, right: 16, background: "#00f5a0", padding: "4px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#0a0a0f" }}>ACTIVE</div>
                  )}

                  <div style={{ fontSize: 28, marginBottom: 8 }}>{plan.id === "basic" ? "🥉" : plan.id === "pro" ? "🥇" : "👑"}</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 2, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "#f0f0f8" }}>₹{plan.price}</div>
                    <div style={{ color: "#6b6b80", fontSize: 14 }}>/ month</div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, marginBottom: 28 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${plan.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: plan.color }} />
                        </div>
                        <span style={{ fontSize: 14, color: "#c0c0cc" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => handlePayment(plan)} disabled={payStatus[plan.id] === "processing"}
                    style={{
                      width: "100%", padding: "14px 0", borderRadius: 12,
                      border: `1px solid ${activePlan === plan.id ? "rgba(0,245,160,0.3)" : plan.popular ? "transparent" : `${plan.color}40`}`,
                      background: activePlan === plan.id ? "rgba(0,245,160,0.15)" : plan.popular ? `linear-gradient(135deg,#ff4d4d,#ff8c00)` : `${plan.color}20`,
                      color: activePlan === plan.id ? "#00f5a0" : plan.popular ? "white" : plan.color,
                      cursor: payStatus[plan.id] === "processing" ? "not-allowed" : "pointer",
                      fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif", letterSpacing: 1
                    } as React.CSSProperties}>
                    {activePlan === plan.id ? "✅ CURRENT PLAN" : payStatus[plan.id] === "processing" ? "⏳ PROCESSING..." : payStatus[plan.id] === "failed" ? "❌ RETRY PAYMENT" : "💳 PAY WITH RAZORPAY"}
                  </button>
                </div>
              ))}
            </div>

            {/* Razorpay Security Badge */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 32px", borderRadius: 16, background: "#12121a", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 28 }}>🔒</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f8" }}>Secured by Razorpay</div>
                  <div style={{ fontSize: 11, color: "#6b6b80" }}>256-bit SSL • PCI DSS Compliant • UPI • Cards • NetBanking</div>
                </div>
                <div style={{ padding: "6px 16px", borderRadius: 8, background: "linear-gradient(135deg,#072654,#1a5cb0)", fontSize: 13, fontWeight: 700, color: "white" }}>RAZORPAY</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
              {["💳 Credit/Debit Card", "📱 UPI", "🏦 NetBanking", "💼 Wallets", "🔄 EMI"].map(m => (
                <div key={m} style={{ color: "#6b6b80", fontSize: 13 }}>{m}</div>
              ))}
            </div>

            {/* Dev note */}
            <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,140,0,0.05)", border: "1px solid rgba(255,140,0,0.2)", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#ff8c00", fontWeight: 600, marginBottom: 6 }}>⚠️ Developer Note</div>
              <div style={{ fontSize: 12, color: "#6b6b80" }}>
                Replace <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 4, color: "#ff4d4d" }}>rzp_test_YourKeyHere</code> with your Razorpay Key ID from <span style={{ color: "#ff8c00" }}>dashboard.razorpay.com</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: 20, color: "#333", fontSize: 12 }}>
        FITNESSE PRO v2.1 — Built by SSD 💪 • Payments by Razorpay
      </div>
    </div>
  );
}
