// app/components/WorkoutLibrary.tsx
"use client";

import { useEffect, useState } from "react";
import WorkoutCard, { Workout } from "./WorkoutCard";

export default function WorkoutLibrary() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <section id="library" className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Container max-width matching HeroBanner's max-w-[1550px] */}
      <div className="max-w-[1550px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2 font-[family-name:var(--font-oswald)]">
            THE LIBRARY
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-normal">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#12141a] border border-zinc-800/80 rounded-3xl h-[420px] animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-zinc-800/50 rounded-2xl mb-4" />
                <div className="w-24 h-6 bg-zinc-800/50 rounded-full mb-3" />
                <div className="w-3/4 h-8 bg-zinc-800/50 rounded-lg mb-2" />
                <div className="w-1/2 h-4 bg-zinc-800/50 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback */}
        {error && !loading && (
          <div className="text-center py-16 bg-[#12141a] rounded-3xl border border-zinc-800/80">
            <p className="text-zinc-400">Could not load workout library right now.</p>
          </div>
        )}

        {/* Workouts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {workouts.map((workout, index) => (
              <WorkoutCard key={workout.id || index} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}