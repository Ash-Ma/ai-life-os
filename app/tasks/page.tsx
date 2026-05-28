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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");

  useEffect(() => {
    const savedTasks = localStorage.getItem("ai-life-tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("ai-life-tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title || !dueDate || !estimatedHours) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      estimatedHours: Number(estimatedHours),
      completedHours: 0,
      priority,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);

    setTitle("");
    setDueDate("");
    setEstimatedHours("");
    setPriority("medium");
  }

  function addProgress(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completedHours: Math.min(
                task.completedHours + 1,
                task.estimatedHours
              ),
            }
          : task
      )
    );
  }

  function deleteTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-cyan-300">AI Life OS</p>

          <h1 className="mt-2 text-4xl font-bold">Tasks</h1>

          <p className="mt-3 text-slate-300">
            Add assignments and track deadline risk.
          </p>

          <form
            onSubmit={addTask}
            className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-4"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <input
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              type="date"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <input
              value={estimatedHours}
              onChange={(event) => setEstimatedHours(event.target.value)}
              type="number"
              min="1"
              placeholder="Hours"
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            />

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as Task["priority"])
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>

            <button className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 md:col-span-4">
              Add Task
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
                No tasks yet. Add your first deadline.
              </div>
            ) : (
              tasks.map((task) => {
                const risk = calculateTaskRisk(task, defaultAvailability);

                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">{task.title}</h2>

                        <p className="mt-2 text-sm text-slate-300">
                          Due: {task.dueDate}
                        </p>

                        <p className="text-sm text-slate-300">
                          Progress: {task.completedHours}/{task.estimatedHours}{" "}
                          hours
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-800 px-3 py-1 text-sm">
                        {risk.level}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-slate-300">
                      <p>Remaining hours: {risk.remainingHours}</p>
                      <p>Days left: {risk.daysUntilDeadline}</p>
                      <p>Risk score: {risk.score}</p>
                    </div>

                    <button
                      onClick={() => addProgress(task.id)}
                      className="mt-5 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
                    >
                      +1 hour progress
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="ml-3 mt-5 rounded-xl border border-red-700 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}