// app/page.tsx
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-white">
      <Navbar planCount={0} savedCount={0} />
      <HeroBanner />
    </main>
  );
}