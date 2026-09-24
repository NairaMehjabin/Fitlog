// app/workout/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, Bookmark, ArrowLeft } from "lucide-react";

interface WorkoutDetail {
  id: string | number;
  name: string;
  description?: string;
  muscleGroups?: string[];
  muscles?: string[];
  category?: string[];
  equipment?: string;
  difficulty?: string;
  sets?: number | string;
  reps?: string;
  duration?: number | string;
  time?: number | string;
  caloriesBurned?: number | string;
  calories?: number | string;
  rating?: number | string;
  instructions?: string[];
  image?: string;
  imageUrl?: string;
}

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
    async function fetchWorkoutDetail() {
      try {
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        if (!res.ok) throw new Error("Failed to fetch workout details");
        const data = await res.json();
        setWorkout(data.data || data);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchWorkoutDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm font-medium">Loading workout details...</p>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-oswald)] uppercase">
          Workout Not Found
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Could not retrieve details for this exercise.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-extrabold text-sm px-5 py-2.5 rounded-xl uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workouts
        </Link>
      </div>
    );
  }

  // Fallbacks
  const tags = workout.muscleGroups || workout.muscles || workout.category || ["Chest", "Arms"];
  const imageSrc = workout.image || workout.imageUrl || "/assets/banner.png";
  const equipment = workout.equipment || "Barbell, Bench";
  const difficulty = workout.difficulty || "Intermediate";
  const sets = workout.sets || "4";
  const reps = workout.reps || "6-8";
  const duration = workout.duration || workout.time || "25 min";
  const calories = workout.caloriesBurned || workout.calories || "180 kcal";
  const rating = workout.rating || "4.8";
  const description =
    workout.description ||
    "A compound press that builds chest thickness, triceps, and pressing power from a stable bench.";

  const instructionsList =
    workout.instructions && workout.instructions.length > 0
      ? workout.instructions
      : [
          "Lie on the bench with eyes under the bar and feet planted.",
          "Unrack with locked elbows and lower the bar to mid-chest.",
          "Press up in a slight arc until elbows lock without bouncing.",
          "Keep shoulder blades pinched and a natural arch in the back.",
        ];

  return (
    <main className="w-full min-h-screen bg-[#0b0c10] text-white py-10 px-4 sm:px-6 lg:px-8 pb-32 pt-20">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14">
        
        {/* Left Column */}
        <div className="w-full max-w-[588px] lg:w-[588px] h-[500px] sm:h-[650px] lg:h-[735px] relative bg-[#12141a] rounded-[28px] overflow-hidden border border-zinc-800/80 shrink-0">
          <Image
            src={imageSrc}
            alt={workout.name}
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full flex flex-col justify-between self-stretch">
          <div>
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold uppercase tracking-tight text-white mb-3 font-[family-name:var(--font-oswald)] leading-none">
              {workout.name}
            </h1>

            {/* Subtitle and Description */}
            <p className="text-zinc-400 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal max-w-xl">
              {description}
            </p>

            {/* Category */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#ccff00] text-black font-extrabold text-[12px] px-4 py-1.5 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Key Specs Panel */}
            <div className="bg-[#12141a]/90 border border-zinc-800/80 rounded-2xl p-5 mb-8 divide-y divide-zinc-800/60">
              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  EQUIPMENT
                </span>
                <span className="text-white font-medium">{equipment}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  DIFFICULTY
                </span>
                <span className="text-white font-medium capitalize">{difficulty}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  SETS
                </span>
                <span className="text-white font-medium">{sets}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  REPS
                </span>
                <span className="text-white font-medium">{reps}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  DURATION
                </span>
                <span className="text-white font-medium">
                  {typeof duration === "number" ? `${duration} min` : duration}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  CALORIES
                </span>
                <span className="text-white font-medium">
                  {typeof calories === "number" ? `${calories} kcal` : calories}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[11px] sm:text-[12px]">
                  RATING
                </span>
                <span className="text-white font-medium">{rating}</span>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h3 className="text-white text-base sm:text-lg font-bold uppercase tracking-wider mb-4 font-[family-name:var(--font-oswald)]">
                INSTRUCTIONS
              </h3>
              <ol className="space-y-3">
                {instructionsList.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    <span className="text-zinc-400 font-semibold select-none">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ccff00] text-black font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-[#b8e600] transition-colors uppercase tracking-wider cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add to today&apos;s plan</span>
            </button>

            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-800 hover:border-zinc-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors uppercase tracking-wider cursor-pointer"
            >
              <Bookmark className="w-4 h-4 stroke-[2.5]" />
              <span>Save for later</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}