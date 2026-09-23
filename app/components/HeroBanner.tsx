// components/HeroBanner.tsx
"use client";

import Image from "next/image";

export default function HeroBanner() {
  const handleScroll = () => {
    const librarySection = document.getElementById("library");
    if (librarySection) {
      librarySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#0b0c10] py-8 px-4 sm:px-6 lg:px-8 pt-15">
      <div className="max-w-[1550px] mx-auto bg-[#12141a] border border-zinc-800/80 rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-2xl z-10 flex-1">
          <span className="text-[#ccff00] text-xs sm:text-sm font-bold tracking-widest uppercase block mb-4">
            Workout Library
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-bold text-white tracking-normal uppercase leading-[1.02] mb-6 font-[family-name:var(--font-oswald)]">
            <span className="whitespace-nowrap">TRAIN WITH INTENT. LOG</span>
            <br />
            <span>EVERY SET.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <button
            onClick={handleScroll}
            className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl hover:bg-[#b8e600] transition-colors cursor-pointer uppercase tracking-wider"
          >
            Browse Workouts
          </button>
        </div>

        {/* Right Media Image */}
        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-square flex items-center justify-center shrink-0">
          <Image
            src="/assets/banner.png"
            alt="Workout Banner - Gym Companion"
            fill
            className="object-contain object-center lg:object-right drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
            priority
          />
        </div>
      </div>
    </section>
  );
}