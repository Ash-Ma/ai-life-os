"use client";

import { useEffect, useState } from "react";
import { calculateBurnoutRisk, calculateTaskRisk } from "@/lib/risk";
import { availability, checkIns, tasks } from "@/lib/mock-data";

export default function DashboardPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
          " · " +
          now.toLocaleDateString([], { month: "short", day: "numeric" })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const taskRisks = tasks.map((task) => ({
    ...task,
    ...calculateTaskRisk(task, availability),
  }));

  const highRiskTasks = taskRisks.filter((t) => t.level === "High");
  const burnout = calculateBurnoutRisk(checkIns, highRiskTasks.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .dashboard-shell {
          min-height: 100vh;
          background: #080c14;
          color: #e2eaf5;
          font-family: 'Syne', sans-serif;
          padding: 1.5rem;
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-shell::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 229, 255, 0.012) 2px,
            rgba(0, 229, 255, 0.012) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ── Top bar ── */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .brand {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .15em;
          color: #00e5ff;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-dot {
          width: 6px;
          height: 6px;
          background: #00e5ff;
          border-radius: 50%;
          animation: pulse 2s infinite;
          box-shadow: 0 0 6px #00e5ff;
        }
        .timestamp {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #4a6080;
        }

        /* ── Title block ── */
        .title-block {
          margin-bottom: 2rem;
        }
        .title-block h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          letter-spacing: -.02em;
          line-height: 1.05;
        }
        .title-block h1 em {
          font-style: normal;
          color: #00e5ff;
        }
        .title-block p {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #4a6080;
          margin-top: .5rem;
          letter-spacing: .05em;
        }

        /* ── KPI Row ── */
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 600px) {
          .kpi-row { grid-template-columns: 1fr; }
        }

        .kpi {
          background: #111827;
          border: 1px solid #1e2d45;
          border-radius: 12px;
          padding: 1.2rem 1rem;
          position: relative;
          overflow: hidden;
          animation: fadeUp .5s both;
        }
        .kpi::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }
        .kpi.cyan::before  { background: #00e5ff; box-shadow: 0 0 12px #00e5ff; }
        .kpi.red::before   { background: #ff3b5c; box-shadow: 0 0 12px #ff3b5c; }
        .kpi.amber::before { background: #ffb930; box-shadow: 0 0 12px #ffb930; }
        .kpi:nth-child(1) { animation-delay: .1s; }
        .kpi:nth-child(2) { animation-delay: .2s; }
        .kpi:nth-child(3) { animation-delay: .3s; }

        .kpi-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: .12em;
          color: #4a6080;
          text-transform: uppercase;
          margin-bottom: .6rem;
        }
        .kpi-val {
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 800;
          line-height: 1;
        }
        .kpi-val.cyan  { color: #00e5ff; }
        .kpi-val.red   { color: #ff3b5c; }
        .kpi-val.amber { color: #ffb930; }
        .kpi-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #4a6080;
          margin-top: .5rem;
          line-height: 1.5;
        }
        .kpi-badge {
          position: absolute;
          bottom: 10px; right: 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #1e2d45;
          letter-spacing: .08em;
        }

        /* ── Recommendation card ── */
        .rec-card {
          background: #0d1420;
          border: 1px solid #1e2d45;
          border-left: 3px solid #00e5ff;
          border-radius: 12px;
          padding: 1.2rem 1.4rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          animation: fadeUp .5s .4s both;
        }
        .rec-icon {
          font-size: 22px;
          color: #00e5ff;
          flex-shrink: 0;
          line-height: 1;
          margin-top: 2px;
        }
        .rec-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: .12em;
          color: #00e5ff;
          text-transform: uppercase;
          margin-bottom: .4rem;
        }
        .rec-title {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: .3rem;
        }
        .rec-body {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #4a6080;
          line-height: 1.6;
        }

        /* ── Section header ── */
        .section-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }
        .section-head h2 {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #4a6080;
          white-space: nowrap;
        }
        .section-head::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1e2d45;
        }

        /* ── Task list ── */
        .tasks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .task-row {
          background: #111827;
          border: 1px solid #1e2d45;
          border-radius: 10px;
          padding: 1rem 1.2rem;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          transition: border-color .2s, transform .15s;
          animation: fadeUp .4s both;
        }
        .task-row:hover {
          border-color: #4a6080;
          transform: translateX(3px);
        }
        .task-row:nth-child(1) { animation-delay: .5s; }
        .task-row:nth-child(2) { animation-delay: .6s; }
        .task-row:nth-child(3) { animation-delay: .7s; }
        .task-row:nth-child(4) { animation-delay: .8s; }
        .task-row:nth-child(5) { animation-delay: .9s; }

        .task-name {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: .35rem;
        }
        .task-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .task-meta span {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: #4a6080;
          letter-spacing: .04em;
        }
        .task-meta span b {
          color: #e2eaf5;
          font-weight: 500;
        }

        /* ── Risk bar ── */
        .risk-bar-wrap { margin-top: .6rem; }
        .risk-score-row {
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px;
          color: #2a3f5a;
          letter-spacing: .06em;
          margin-bottom: .25rem;
        }
        .risk-bar {
          height: 3px;
          background: #1a2535;
          border-radius: 2px;
          overflow: hidden;
        }
        .risk-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1.2s cubic-bezier(.4, 0, .2, 1);
        }
        .risk-fill.high   { background: #ff3b5c; box-shadow: 0 0 6px #ff3b5c60; }
        .risk-fill.medium { background: #ffb930; box-shadow: 0 0 6px #ffb93060; }
        .risk-fill.low    { background: #00ff9d; box-shadow: 0 0 6px #00ff9d60; }

        /* ── Badge ── */
        .badge {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .08em;
          padding: 5px 12px;
          border-radius: 20px;
          white-space: nowrap;
          text-align: center;
          text-transform: uppercase;
        }
        .badge.high   { background: rgba(255,59,92,.12); color: #ff3b5c; border: 1px solid rgba(255,59,92,.3); }
        .badge.medium { background: rgba(255,185,48,.12); color: #ffb930; border: 1px solid rgba(255,185,48,.3); }
        .badge.low    { background: rgba(0,255,157,.10); color: #00ff9d; border: 1px solid rgba(0,255,157,.25); }

        /* ── Animations ── */
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .4; transform: scale(.8); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="dashboard-shell">
        <div className="inner">

          {/* Top bar */}
          <div className="topbar">
            <div className="brand">
              <span className="brand-dot" />
              AI Life OS · v2.4
            </div>
            <div className="timestamp">{time}</div>
          </div>

          {/* Title */}
          <div className="title-block">
            <h1>
              Your <em>Command</em>
              <br />
              Center
            </h1>
            <p>// deadline &amp; burnout prediction · live</p>
          </div>

          {/* KPI cards */}
          <div className="kpi-row">
            <div className="kpi cyan">
              <div className="kpi-label">Today's Rec</div>
              <div className="kpi-val cyan" style={{ fontSize: "18px", lineHeight: 1.2 }}>
                ML · 45 min
              </div>
              <div className="kpi-sub">
                High-risk assignment
                <br />
                tonight, 8 PM
              </div>
              <div className="kpi-badge">ACTION</div>
            </div>

            <div className="kpi red">
              <div className="kpi-label">High Risk Tasks</div>
              <div className="kpi-val red">{highRiskTasks.length}</div>
              <div className="kpi-sub">
                May miss
                <br />
                deadlines
              </div>
              <div className="kpi-badge">WATCH</div>
            </div>

            <div className="kpi amber">
              <div className="kpi-label">Burnout Risk</div>
              <div className="kpi-val amber">{burnout.level}</div>
              <div className="kpi-sub">
                Score: {burnout.score}
                <br />
                Monitor closely
              </div>
              <div className="kpi-badge">RISK</div>
            </div>
          </div>

          {/* Recommendation card */}
          <div className="rec-card">
            <div className="rec-icon">⚡</div>
            <div>
              <div className="rec-label">Priority Recommendation</div>
              <div className="rec-title">Study ML for 45 minutes tonight</div>
              <div className="rec-body">
                Your ML assignment is escalating to high risk due to workload
                concentration and deadline pressure. Recommend blocking 8–8:45 PM tonight.
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="section-head">
            <h2>Task Risk Analysis</h2>
          </div>

          <div className="tasks">
            {taskRisks.map((task) => {
              const level = task.level.toLowerCase() as "high" | "medium" | "low";
              const pct = Math.min(task.score ?? 0, 100);

              return (
                <div key={task.id} className="task-row">
                  <div>
                    <div className="task-name">{task.title}</div>
                    <div className="task-meta">
                      <span>
                        <b>{task.remainingHours}h</b> remaining
                      </span>
                      <span>
                        <b>{task.daysUntilDeadline}d</b> until deadline
                      </span>
                    </div>
                    <div className="risk-bar-wrap">
                      <div className="risk-score-row">
                        <span>risk score</span>
                        <span>{task.score}</span>
                      </div>
                      <div className="risk-bar">
                        <div
                          className={`risk-fill ${level}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`badge ${level}`}>{task.level}</div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}