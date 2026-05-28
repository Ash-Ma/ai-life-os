import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-bold text-cyan-300">
          AI Life OS
        </Link>

        <div className="flex gap-4 text-sm text-slate-300">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>

          <Link href="/tasks" className="hover:text-white">
            Tasks
          </Link>

          <Link href="/recommendation" className="hover:text-white">
  AI Recommendation
</Link>
        </div>
      </div>
    </nav>
  );
}