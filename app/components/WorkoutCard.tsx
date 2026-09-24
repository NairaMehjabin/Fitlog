"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Star } from "lucide-react";

export interface Workout {
  id: string | number;
  name: string;
  muscleGroups?: string[];
  muscles?: string[];
  category?: string[];
  equipment?: string;
  difficulty?: string;
  duration?: number | string;
  time?: number | string;
  caloriesBurned?: number | string;
  calories?: number | string;
  rating?: number | string;
  score?: number | string;
  image?: string;
  imageUrl?: string;
  description?: string;
}

export interface WorkoutCardProps {
  workout: Workout;
  isPlanFull?: boolean;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const tags: string[] = workout.muscleGroups || workout.muscles || workout.category || [];
  const imageSrc = workout.image || workout.imageUrl || "/assets/banner.png";
  const durationText = workout.duration || workout.time || "20";
  const caloriesText = workout.caloriesBurned || workout.calories || "150";
  const ratingText = workout.rating || workout.score || "4.8";
  const difficulty = workout.difficulty;

  return (
    <Link href={`/workout/${workout.id}`} className="block h-full group">
      <div className="bg-[#12141a] border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 h-full">
        {/* Image Container with Badges */}
        <div className="relative w-full aspect-[16/10] bg-zinc-900 overflow-hidden">
          <Image
            src={imageSrc}
            alt={workout.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {difficulty ? (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10 capitalize">
                {difficulty}
              </span>
            ) : (
              <div />
            )}

            {ratingText && (
              <div className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{ratingText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#ccff00] text-black font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-white text-2xl font-bold uppercase tracking-tight mb-1 font-[family-name:var(--font-oswald)] leading-tight group-hover:text-[#ccff00] transition-colors">
              {workout.name}
            </h3>

            {/* Subtitle */}
            {workout.equipment && (
              <p className="text-zinc-500 text-sm font-normal mb-6">
                {workout.equipment}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-5 text-zinc-400 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{typeof durationText === "number" ? `${durationText} min` : `${durationText} min`}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-zinc-400" />
              <span>{typeof caloriesText === "number" ? `${caloriesText} kcal` : `${caloriesText} kcal`}</span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <Star className="w-4 h-4 text-zinc-400 fill-zinc-400" />
              <span className="text-zinc-300 font-semibold">{ratingText}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}