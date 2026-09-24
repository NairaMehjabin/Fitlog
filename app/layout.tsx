// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className={`${inter.className} bg-[#0b0c10] text-white antialiased min-h-screen flex flex-col justify-between`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        {/*Toast */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#12141a",
              color: "#ffffff",
              border: "1px solid #27272a",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#ccff00",
                secondary: "#0b0c10",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}