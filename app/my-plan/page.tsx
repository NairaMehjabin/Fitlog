"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Clock,
  Flame,
  Star,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";

export interface PlanItem {
  id: string | number;
  name: string;
  equipment?: string;
  duration?: number | string;
  time?: number | string;
  caloriesBurned?: number | string;
  calories?: number | string;
  rating?: number | string;
  image?: string;
  imageUrl?: string;
}

type TabType = "today" | "saved";
type SortOption = "duration" | "calories" | "rating";

function MyPlanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTabParam = searchParams.get("tab") === "saved" ? "saved" : "today";
  const [activeTab, setActiveTab] = useState<TabType>(currentTabParam);

  const [sortBy, setSortBy] = useState<SortOption>("duration");
  const [searchQuery, setSearchQuery] = useState("");

  const [todayPlan, setTodayPlan] = useState<PlanItem[]>([]);
  const [savedPlan, setSavedPlan] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(currentTabParam);
  }, [currentTabParam]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(`/my-plan?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    try {
      const storedToday = localStorage.getItem("fitlog_today_plan");
      const storedSaved = localStorage.getItem("fitlog_saved_plan");

      if (storedToday) setTodayPlan(JSON.parse(storedToday));
      if (storedSaved) setSavedPlan(JSON.parse(storedSaved));
    } catch (err) {
      console.error("Error reading from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodayPlan = (newList: PlanItem[]) => {
    setTodayPlan(newList);
    localStorage.setItem("fitlog_today_plan", JSON.stringify(newList));
    window.dispatchEvent(new Event("fitlog_storage_update"));
  };

  const updateSavedPlan = (newList: PlanItem[]) => {
    setSavedPlan(newList);
    localStorage.setItem("fitlog_saved_plan", JSON.stringify(newList));
    window.dispatchEvent(new Event("fitlog_storage_update"));
  };

  const parseNum = (val?: number | string): number => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const matched = val.match(/\d+(\.\d+)?/);
    return matched ? parseFloat(matched[0]) : 0;
  };

  const totalExercises = todayPlan.length;
  const totalMinutes = useMemo(() => {
    return todayPlan.reduce(
      (acc, item) => acc + parseNum(item.duration || item.time),
      0
    );
  }, [todayPlan]);

  const totalCalories = useMemo(() => {
    return todayPlan.reduce(
      (acc, item) => acc + parseNum(item.caloriesBurned || item.calories),
      0
    );
  }, [todayPlan]);

  const rawList = activeTab === "today" ? todayPlan : savedPlan;

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return rawList;
    const query = searchQuery.toLowerCase().trim();

    return rawList.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const equipmentMatch = item.equipment?.toLowerCase().includes(query);
      return nameMatch || equipmentMatch;
    });
  }, [rawList, searchQuery]);

  const sortedList = useMemo(() => {
    const listCopy = [...filteredList];
    return listCopy.sort((a, b) => {
      if (sortBy === "duration") {
        const durA = parseNum(a.duration || a.time);
        const durB = parseNum(b.duration || b.time);
        return durB - durA;
      }
      if (sortBy === "calories") {
        const calA = parseNum(a.caloriesBurned || a.calories);
        const calB = parseNum(b.caloriesBurned || b.calories);
        return calB - calA;
      }
      if (sortBy === "rating") {
        const ratA = parseNum(a.rating);
        const ratB = parseNum(b.rating);
        return ratB - ratA;
      }
      return 0;
    });
  }, [filteredList, sortBy]);

  const handleMarkAsDone = (item: PlanItem) => {
    const updated = todayPlan.filter((i) => i.id !== item.id);
    updateTodayPlan(updated);
    toast.success(`Completed "${item.name}"! Great work.`);
  };

  const handleRemoveItem = (item: PlanItem) => {
    if (activeTab === "today") {
      const updated = todayPlan.filter((i) => i.id !== item.id);
      updateTodayPlan(updated);
      toast.success(`Removed "${item.name}" from Today's Plan`);
    } else {
      const updated = savedPlan.filter((i) => i.id !== item.id);
      updateSavedPlan(updated);
      toast.success(`Removed "${item.name}" from Saved Lifts`);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0b0c10] text-white py-10 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-2 font-[family-name:var(--font-oswald)]">
            MY PLAN
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-normal">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        {/* Metrics Summary Row */}
        <div className="bg-[#12141a]/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
          <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium mb-1">
              Exercises
            </span>
            <span className="text-4xl sm:text-5xl font-bold text-[#ccff00] font-[family-name:var(--font-oswald)]">
              {totalExercises}
            </span>
          </div>

          <div className="pt-4 md:pt-0 md:px-8 flex flex-col justify-center">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium mb-1">
              Minutes
            </span>
            <span className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-oswald)]">
              {totalMinutes}
            </span>
          </div>

          <div className="pt-4 md:pt-0 md:px-8 flex flex-col justify-center">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium mb-1">
              Calories
            </span>
            <span className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-oswald)]">
              {totalCalories}
            </span>
          </div>
        </div>

        {/* Search, Tabs & Sort Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            {/* Tabs Toggle */}
            <div className="bg-[#12141a] border border-zinc-800/80 p-1 rounded-2xl inline-flex items-center shrink-0">
              <button
                onClick={() => handleTabChange("today")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "today"
                    ? "bg-[#1e2028] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Today&apos;s Plan ({todayPlan.length})
              </button>
              <button
                onClick={() => handleTabChange("saved")}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-[#1e2028] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Saved ({savedPlan.length})
              </button>
            </div>

            {/* Plan Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plan exercises..."
                className="w-full bg-[#12141a] border border-zinc-800/80 text-white placeholder-zinc-500 text-xs sm:text-sm rounded-xl pl-10 pr-9 py-2.5 focus:outline-none focus:border-[#ccff00] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <span className="text-zinc-400 text-xs sm:text-sm font-medium">Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-[#12141a] border border-zinc-800 text-white text-xs sm:text-sm rounded-xl pl-4 pr-9 py-2.5 font-semibold focus:outline-none focus:border-[#ccff00] cursor-pointer"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#12141a] border border-zinc-800/80 rounded-2xl h-28 animate-pulse p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-24 h-20 bg-zinc-800/50 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="w-40 h-6 bg-zinc-800/50 rounded" />
                    <div className="w-24 h-4 bg-zinc-800/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State Layout */}
        {!loading && sortedList.length === 0 && (
          <div className="border border-dashed border-zinc-800/80 rounded-3xl py-20 px-4 text-center bg-[#12141a]/40 flex flex-col items-center justify-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white mb-2 font-[family-name:var(--font-oswald)] tracking-wide">
              {searchQuery ? "NO MATCHING EXERCISES" : "NOTHING HERE YET"}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base mb-6 max-w-md">
              {searchQuery
                ? `No entries found matching "${searchQuery}". Try a different keyword.`
                : "Browse the library and add a lift to get today moving."}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-extrabold text-sm px-6 py-3.5 rounded-full hover:bg-[#b8e600] transition-all uppercase tracking-wider shadow-lg shadow-[#ccff00]/10"
            >
              <span>Go to workouts</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        )}

        {/* Workout Cards List */}
        {!loading && sortedList.length > 0 && (
          <div className="space-y-4">
            {sortedList.map((item) => {
              const imageSrc = item.image || item.imageUrl || "/assets/banner.png";
              const equipment = item.equipment || "Standard Equipment";
              const duration = item.duration || item.time || "20 min";
              const calories = item.caloriesBurned || item.calories || "150 kcal";
              const rating = item.rating || "4.8";

              return (
                <div
                  key={item.id}
                  className="bg-[#12141a] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-zinc-700/80"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-800">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                        unoptimized
                      />
                    </div>

                    <div>
                      <h4 className="text-lg sm:text-xl font-bold uppercase text-white font-[family-name:var(--font-oswald)] tracking-tight mb-0.5">
                        {item.name}
                      </h4>
                      <p className="text-zinc-400 text-xs sm:text-sm mb-2.5">
                        {equipment}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-300">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                          {typeof duration === "number" ? `${duration} min` : duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
                          {typeof calories === "number" ? `${calories} kcal` : calories}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-[#ccff00] fill-[#ccff00]" />
                          {rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
                    <Link
                      href={`/workout/${item.id}`}
                      className="inline-flex items-center justify-center bg-transparent border border-zinc-800 hover:border-zinc-600 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                    >
                      View Details
                    </Link>

                    {activeTab === "today" && (
                      <button
                        onClick={() => handleMarkAsDone(item)}
                        className="inline-flex items-center gap-1.5 bg-[#ccff00] text-black font-extrabold text-xs px-4 py-2.5 rounded-full hover:bg-[#b8e600] transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Mark as Done</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer rounded-lg"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0c10]" />}>
      <MyPlanContent />
    </Suspense>
  );
}