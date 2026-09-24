"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  planCount?: number;
  savedCount?: number;
}

export default function Navbar({
  planCount: initialPlanCount,
  savedCount: initialSavedCount,
}: NavbarProps) {
  const pathname = usePathname();

  const [todayCount, setTodayCount] = useState<number>(initialPlanCount ?? 0);
  const [savedLiftsCount, setSavedLiftsCount] = useState<number>(initialSavedCount ?? 0);

  const syncCountsFromStorage = useCallback(() => {
    try {
      const storedToday = localStorage.getItem("fitlog_today_plan");
      const storedSaved = localStorage.getItem("fitlog_saved_plan");

      if (storedToday) {
        const parsedToday = JSON.parse(storedToday);
        setTodayCount(Array.isArray(parsedToday) ? parsedToday.length : 0);
      } else {
        setTodayCount(0);
      }

      if (storedSaved) {
        const parsedSaved = JSON.parse(storedSaved);
        setSavedLiftsCount(Array.isArray(parsedSaved) ? parsedSaved.length : 0);
      } else {
        setSavedLiftsCount(0);
      }
    } catch (err) {
      console.error("Failed to read counts from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    syncCountsFromStorage();

    const handleCustomUpdate = () => {
      syncCountsFromStorage();
    };

    window.addEventListener("fitlog_storage_update", handleCustomUpdate);
    window.addEventListener("storage", syncCountsFromStorage);

    return () => {
      window.removeEventListener("fitlog_storage_update", handleCustomUpdate);
      window.removeEventListener("storage", syncCountsFromStorage);
    };
  }, [syncCountsFromStorage]);

  const isWorkoutsActive = pathname === "/";
  const isMyPlanActive = pathname === "/my-plan";

  return (
    <header className="bg-[#0b0c10] border-b border-zinc-800/60 sticky top-0 z-50 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/assets/logo.png"
            alt="FitLog Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            priority
          />
          <span className="text-white font-bold text-2xl tracking-wider uppercase font-[family-name:var(--font-oswald)]">
            FitLog
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isWorkoutsActive
                ? "bg-[#1e2d08] text-[#ccff00]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Workouts
          </Link>
          <Link
            href="/my-plan?tab=today"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isMyPlanActive
                ? "bg-[#1e2d08] text-[#ccff00]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Plan
          </Link>
        </nav>

        {/* Status Badges */}
        <div className="flex items-center gap-4">
          {/* Plan Badge */}
          <Link
            href="/my-plan?tab=today"
            className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span>Plan</span>
            <span className="bg-[#ccff00] text-black font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-110">
              {todayCount}
            </span>
          </Link>

          {/* Saved Badge */}
          <Link
            href="/my-plan?tab=saved"
            className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span>Saved</span>
            <span className="border border-zinc-700 text-zinc-300 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-110">
              {savedLiftsCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}