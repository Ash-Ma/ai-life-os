"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import type { Task } from "@/types";
import { calculateTaskRisk } from "@/lib/risk";

const defaultAvailability = [
  { date: "2026-05-30", availableHours: 1 },
  { date: "2026-05-31", availableHours: 2 },
  { date: "2026-06-01", availableHours: 2 },
];

export default function RecommendationPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("ai-life-tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const taskRisks = tasks.map((task) => ({
    task,
    risk: calculateTaskRisk(task, defaultAvailability),
  }));

  const highestRisk = [...taskRisks].sort(
    (a, b) => b.risk.score - a.risk.score
  )[0];

  const recommendations = highestRisk
    ? [
        `Work on ${highestRisk.task.title} for at least 45 minutes today.`,
        `Break "${highestRisk.task.title}" into smaller subtasks.`,
        "Start with the hardest or most urgent section first.",
        "Use a 25-minute focused study/work session (Pomodoro).",
        "Turn off distractions like social media or notifications.",
        `Review the deadline for "${highestRisk.task.title}" and plan backwards.`,
        "Complete at least one milestone today.",
        "Organize notes, resources, or files related to the task.",
        "If blocked, ask a mentor, friend, or teammate for help.",
        "Schedule another session tomorrow to stay consistent.",
        "Update your progress after today's work session.",
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="p-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-cyan-300">AI Life OS</p>
          <h1 className="mt-2 text-4xl font-bold">
            AI Recommendations
          </h1>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            {!highestRisk ? (
              <p className="text-slate-300">
                Add tasks first to generate recommendations.
              </p>
            ) : (
              <>
                <p className="text-sm text-slate-400">
                  Highest Priority Today
                </p>

                <h2 className="mt-3 text-2xl font-bold text-cyan-300">
                  Work on {highestRisk.task.title}
                </h2>

                <p className="mt-4 text-slate-300">
                  This task has a risk score of{" "}
                  <span className="font-semibold text-red-400">
                    {highestRisk.risk.score}
                  </span>{" "}
                  and is currently marked as{" "}
                  <span className="font-semibold text-yellow-400 capitalize">
                    {highestRisk.risk.level}
                  </span>{" "}
                  risk.
                </p>

                <div className="mt-6 rounded-xl bg-slate-950 p-5 text-slate-200 border border-slate-800">
                  <p>
                    You have{" "}
                    <span className="font-bold text-cyan-300">
                      {highestRisk.risk.remainingHours} hours
                    </span>{" "}
                    remaining and{" "}
                    <span className="font-bold text-cyan-300">
                      {highestRisk.risk.daysUntilDeadline} days
                    </span>{" "}
                    left before the deadline.
                  </p>
                </div>

                {/* Recommendations List */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                    11 AI Recommendations
                  </h3>

                  <div className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-5 hover:border-cyan-500 transition"
                      >
                        <p className="text-slate-200">
                          <span className="font-semibold text-cyan-300">
                            Recommendation {index + 1}:
                          </span>{" "}
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}