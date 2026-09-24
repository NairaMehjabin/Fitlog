"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Search, X, ChevronDown, Loader2 } from "lucide-react";
import WorkoutCard, { Workout } from "./WorkoutCard";

type SortOption = "duration" | "calories" | "rating";

export default function WorkoutLibrary() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("duration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [planCount, setPlanCount] = useState<number>(0);

  const syncPlanCount = useCallback(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog_today_plan");
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan);
        setPlanCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setPlanCount(0);
      }
    } catch (e) {
      console.error("Error reading plan count from localStorage", e);
    }
  }, []);

  useEffect(() => {
    syncPlanCount();

    window.addEventListener("fitlog_storage_update", syncPlanCount);
    window.addEventListener("storage", syncPlanCount);

    async function fetchWorkouts() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
        if (!res.ok) throw new Error("Failed to fetch workouts");
        const data = await res.json();
        setWorkouts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();

    return () => {
      window.removeEventListener("fitlog_storage_update", syncPlanCount);
      window.removeEventListener("storage", syncPlanCount);
    };
  }, [syncPlanCount]);

  // Filter and Sort workouts
  const processedWorkouts = useMemo(() => {
    let result = [...workouts];

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((workout) => {
        const nameMatch = workout.name?.toLowerCase().includes(query);
        const tags =
          workout.muscleGroups || workout.muscles || workout.category || [];
        const tagMatch = tags.some((tag) => tag.toLowerCase().includes(query));

        return nameMatch || tagMatch;
      });
    }

    // Sort Logic 
    return result.sort((a, b) => {
      if (sortBy === "duration") {
        const durA = Number(a.duration || a.time || 0);
        const durB = Number(b.duration || b.time || 0);
        return durB - durA;
      }
      if (sortBy === "calories") {
        const calA = Number(a.calories || a.caloriesBurned || 0);
        const calB = Number(b.calories || b.caloriesBurned || 0);
        return calB - calA;
      }
      if (sortBy === "rating") {
        const rateA = Number(a.rating || a.score || 0);
        const rateB = Number(b.rating || b.score || 0);
        return rateB - rateA;
      }
      return 0;
    });
  }, [workouts, searchQuery, sortBy]);

  const isPlanFull = planCount >= 5;

  return (
    <section id="library" className="w-full py-8 px-4 sm:px-6 lg:px-8 pb-35">
      <div className="max-w-[1550px] mx-auto">
        
        {/* Header & Controls Container */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2 font-[family-name:var(--font-oswald)]">
              THE LIBRARY
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-normal">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or tag..."
                className="w-full bg-[#12141a] border border-zinc-800 text-white placeholder-zinc-500 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#ccff00] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full sm:w-auto appearance-none bg-[#12141a] border border-zinc-800 text-white text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-[#ccff00] transition-colors cursor-pointer"
              >
                <option value="duration" className="bg-[#12141a] text-white">
                  Sort By: Duration
                </option>
                <option value="calories" className="bg-[#12141a] text-white">
                  Sort By: Calories
                </option>
                <option value="rating" className="bg-[#12141a] text-white">
                  Sort By: Rating
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>

        {/* Loading Spinner Circle State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 bg-[#12141a]/60 border border-zinc-800/80 rounded-3xl backdrop-blur-md">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute w-16 h-16 rounded-full border-2 border-[#ccff00]/20 animate-ping" />
              {/* Spinning gradient loader */}
              <Loader2 className="w-12 h-12 text-[#ccff00] animate-spin stroke-[1.75]" />
            </div>
            <p className="mt-6 text-zinc-200 text-sm font-semibold tracking-wider uppercase font-[family-name:var(--font-oswald)]">
              Fetching Workout Library...
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Preparing exercises and target muscle groups
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {error && !loading && (
          <div className="text-center py-16 bg-[#12141a] rounded-3xl border border-zinc-800/80">
            <p className="text-zinc-400">Could not load workout library right now.</p>
          </div>
        )}

        {/* No Results Fallback */}
        {!loading && !error && processedWorkouts.length === 0 && (
          <div className="text-center py-16 bg-[#12141a] rounded-3xl border border-zinc-800/80">
            <p className="text-zinc-300 font-semibold mb-1">No workouts found</p>
            <p className="text-zinc-500 text-sm">
              Try searching for different terms like &quot;Chest&quot;, &quot;Bench&quot;, or &quot;Legs&quot;.
            </p>
          </div>
        )}

        {/* Workouts Grid */}
        {!loading && !error && processedWorkouts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {processedWorkouts.map((workout, index) => (
              <WorkoutCard
                key={workout.id || index}
                workout={workout}
                isPlanFull={isPlanFull}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}