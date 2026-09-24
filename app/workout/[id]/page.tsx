"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, Bookmark, ArrowLeft, Check } from "lucide-react";
import { toast } from "react-hot-toast";

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

  const [inTodayPlan, setInTodayPlan] = useState(false);
  const [inSavedPlan, setInSavedPlan] = useState(false);
  const [todayCount, setTodayCount] = useState<number>(0);

  useEffect(() => {
    async function fetchWorkoutDetail() {
      try {
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        if (!res.ok) throw new Error("Failed to fetch workout details");
        const data = await res.json();
        const workoutData = data.data || data;
        setWorkout(workoutData);

        // Check stored state
        const storedToday = localStorage.getItem("fitlog_today_plan");
        const storedSaved = localStorage.getItem("fitlog_saved_plan");

        if (storedToday) {
          const list: WorkoutDetail[] = JSON.parse(storedToday);
          setTodayCount(list.length);
          setInTodayPlan(list.some((item) => String(item.id) === String(workoutData.id)));
        }

        if (storedSaved) {
          const list: WorkoutDetail[] = JSON.parse(storedSaved);
          setInSavedPlan(list.some((item) => String(item.id) === String(workoutData.id)));
        }
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

  const handleToggleTodayPlan = () => {
    if (!workout) return;

    try {
      const stored = localStorage.getItem("fitlog_today_plan");
      let currentList: WorkoutDetail[] = stored ? JSON.parse(stored) : [];

      if (inTodayPlan) {
        // Remove item
        currentList = currentList.filter((item) => String(item.id) !== String(workout.id));
        setInTodayPlan(false);
        setTodayCount(currentList.length);
        toast.success(`Removed "${workout.name}" from Today's Plan`);
      } else {
        if (currentList.length >= 5) {
          toast.error("Cap of 5 lifts reached for today! Finish some to add more.");
          return;
        }
        // Add item
        currentList.push(workout);
        setInTodayPlan(true);
        setTodayCount(currentList.length);
        toast.success(`Added "${workout.name}" to Today's Plan!`);
      }

      localStorage.setItem("fitlog_today_plan", JSON.stringify(currentList));
      window.dispatchEvent(new Event("fitlog_storage_update"));
    } catch (err) {
      console.error("Error updating today's plan:", err);
    }
  };

  // Add or Remove from Saved Lifts
  const handleToggleSavedPlan = () => {
    if (!workout) return;

    try {
      const stored = localStorage.getItem("fitlog_saved_plan");
      let currentList: WorkoutDetail[] = stored ? JSON.parse(stored) : [];

      if (inSavedPlan) {
        // Remove item
        currentList = currentList.filter((item) => String(item.id) !== String(workout.id));
        setInSavedPlan(false);
        toast.success(`Removed "${workout.name}" from Saved Lifts`);
      } else {
        // Add item
        currentList.push(workout);
        setInSavedPlan(true);
        toast.success(`Saved "${workout.name}" for later!`);
      }

      localStorage.setItem("fitlog_saved_plan", JSON.stringify(currentList));
      window.dispatchEvent(new Event("fitlog_storage_update"));
    } catch (err) {
      console.error("Error updating saved plan:", err);
    }
  };

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

  const isPlanCapped = todayCount >= 5 && !inTodayPlan;

  return (
    <main className="w-full min-h-screen bg-[#0b0c10] text-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 pt-16 sm:pt-20">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-10 lg:gap-14">
        
        {/* Left Column - Responsive Aspect Ratio */}
        <div className="w-full lg:w-[588px] aspect-[4/5] sm:aspect-[4/3] lg:aspect-auto lg:h-[735px] relative bg-[#12141a] rounded-2xl sm:rounded-[28px] overflow-hidden border border-zinc-800/80 shrink-0">
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
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold uppercase tracking-tight text-white mb-2 sm:mb-3 font-[family-name:var(--font-oswald)] leading-none">
              {workout.name}
            </h1>

            {/* Subtitle and Description */}
            <p className="text-zinc-400 text-xs sm:text-sm lg:text-[15px] leading-relaxed mb-5 sm:mb-6 font-normal max-w-xl">
              {description}
            </p>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#ccff00] text-black font-extrabold text-[11px] sm:text-[12px] px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Key Specs Panel */}
            <div className="bg-[#12141a]/90 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 divide-y divide-zinc-800/60">
              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  EQUIPMENT
                </span>
                <span className="text-white font-medium text-right ml-2">{equipment}</span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  DIFFICULTY
                </span>
                <span className="text-white font-medium capitalize">{difficulty}</span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  SETS
                </span>
                <span className="text-white font-medium">{sets}</span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  REPS
                </span>
                <span className="text-white font-medium">{reps}</span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  DURATION
                </span>
                <span className="text-white font-medium">
                  {typeof duration === "number" ? `${duration} min` : duration}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  CALORIES
                </span>
                <span className="text-white font-medium">
                  {typeof calories === "number" ? `${calories} kcal` : calories}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-2.5 text-xs sm:text-sm">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase text-[10px] sm:text-[12px]">
                  RATING
                </span>
                <span className="text-white font-medium">{rating}</span>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-white text-sm sm:text-lg font-bold uppercase tracking-wider mb-3 sm:mb-4 font-[family-name:var(--font-oswald)]">
                INSTRUCTIONS
              </h3>
              <ol className="space-y-2.5 sm:space-y-3">
                {instructionsList.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
                    <span className="text-zinc-400 font-semibold select-none shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={handleToggleTodayPlan}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                inTodayPlan
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : isPlanCapped
                  ? "bg-zinc-800/80 text-zinc-400 border border-zinc-700/80 opacity-70 hover:opacity-100"
                  : "bg-[#ccff00] text-black hover:bg-[#b8e600]"
              }`}
            >
              {inTodayPlan ? (
                <>
                  <Check className="w-4 h-4 stroke-[3] text-[#ccff00]" />
                  <span>Added to Today&apos;s Plan</span>
                </>
              ) : isPlanCapped ? (
                <>
                  <CalendarPlus className="w-4 h-4 stroke-[2.5] text-zinc-400" />
                  <span>Plan Full (5/5)</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to today&apos;s plan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleSavedPlan}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                inSavedPlan
                  ? "bg-zinc-800 text-[#ccff00] border border-[#ccff00]/40"
                  : "bg-transparent border border-zinc-800 hover:border-zinc-700 text-white"
              }`}
            >
              <Bookmark className={`w-4 h-4 stroke-[2.5] ${inSavedPlan ? "fill-[#ccff00]" : ""}`} />
              <span>{inSavedPlan ? "Saved in Lifts" : "Save for later"}</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}