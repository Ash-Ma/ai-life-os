import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
          AI Life Operating System
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          Predict missed deadlines before they happen.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          A personal AI strategist for students that tracks deadlines, workload,
          energy, and stress — then tells you exactly what to do today.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Open Dashboard
          </Link>

          <Link
            href="/tasks"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            Add Tasks
          </Link>

          <Link
            href="/recommendation"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            Get AI Plan
          </Link>
        </div>
      </section>
    </main>
  );
}