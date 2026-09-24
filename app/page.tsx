// app/page.tsx
import HeroBanner from "./components/HeroBanner";
import WorkoutLibrary from "./components/WorkoutLibrary";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-white">
      <HeroBanner />
      <WorkoutLibrary />
    </main>
  );
}