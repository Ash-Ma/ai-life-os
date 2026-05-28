import {
  calculateBurnoutRisk,
  calculateTaskRisk,
} from "@/lib/risk";

import {
  availability,
  checkIns,
  tasks,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const taskRisks = tasks.map((task) =>
    calculateTaskRisk(task, availability)
  );

  const highRiskTasks = taskRisks.filter(
    (task) => task.level === "High"
  );

  const burnout = calculateBurnoutRisk(
    checkIns,
    highRiskTasks.length
  );

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-cyan-300">
          AI Life OS
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-slate-300">
          Your deadline and burnout prediction center.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Today’s recommendation
            </p>

            <h2 className="mt-3 text-xl font-semibold">
              Study ML for 45 minutes tonight
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Your ML assignment is becoming
              high risk due to workload and
              deadline pressure.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              High Risk Tasks
            </p>

            <h2 className="mt-3 text-3xl font-bold text-red-400">
              {highRiskTasks.length}
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Tasks that may miss deadlines.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Burnout Risk
            </p>

            <h2 className="mt-3 text-3xl font-bold text-yellow-300">
              {burnout.level}
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Burnout score: {burnout.score}
            </p>
          </section>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Task Risk Analysis
          </h2>

          <div className="space-y-4">
            {tasks.map((task) => {
              const risk = calculateTaskRisk(
                task,
                availability
              );

              return (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {task.title}
                    </h3>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm">
                      {risk.level}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-slate-300">
                    <p>
                      Remaining Hours:{" "}
                      {risk.remainingHours}
                    </p>

                    <p>
                      Days Left:{" "}
                      {risk.daysUntilDeadline}
                    </p>

                    <p>
                      Risk Score: {risk.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}