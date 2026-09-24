import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c10] border-t border-zinc-800/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1550px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Dumbbell className="w-6 h-6 text-[#ccff00] -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          <span className="text-xl font-extrabold uppercase tracking-wider text-white font-[family-name:var(--font-oswald)]">
            FITLOG
          </span>
        </Link>

        {/* Right Side */}
        <p className="text-zinc-500 text-xs sm:text-sm font-normal text-center sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}