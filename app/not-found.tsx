import Link from "next/link";
import { Dumbbell, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Accent Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#ccff00]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 bg-[#12141a]/80 border border-zinc-800/80 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
        {/* Giant Watermark / Badge */}
        <div className="relative inline-block mb-6">
          <span className="text-8xl sm:text-9xl font-extrabold text-zinc-800/40 select-none font-[family-name:var(--font-oswald)] tracking-widest">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <Dumbbell className="w-8 h-8" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-3 font-[family-name:var(--font-oswald)]">
          Page Dropped The Bar
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Looks like this set doesn&apos;t exist or was removed from your routine. Let&apos;s reroute back to active training.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ccff00] text-black font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[#b8e600] active:scale-95 transition-all shadow-lg shadow-[#ccff00]/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>

          <Link
            href="/#library"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1a1d24] border border-zinc-800 text-zinc-300 font-semibold text-sm px-6 py-3.5 rounded-xl hover:text-white hover:border-zinc-700 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Library
          </Link>
        </div>
      </div>
    </main>
  );
}