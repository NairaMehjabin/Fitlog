# 🏋️‍♂️ Fitlog — Fitness & Workout Management Web App

**Fitlog** is a dark, no-nonsense workout tracking web application designed to help users browse, filter, and plan their fitness routines seamlessly. Built with Next.js App Router, TypeScript, and Tailwind CSS, Fitlog provides an intuitive UI to manage daily workout plans effectively with real-time stats updates and LocalStorage persistence.

🌐 **Live Demo:** [fitlog-naira2.vercel.app](https://fitlog-naira2.vercel.app/)  
📂 **GitHub Repository:** [github.com/NairaMehjabin/Fitlog](https://github.com/NairaMehjabin/Fitlog)

---

## ✨ Key Features

1. **🏋️ Interactive 3x4 Workout Library:** Browse 12 major lifts covering various muscle groups with difficulty ratings, equipment specs, estimated duration, and calories burned fetched live from the API.
2. **🔍 Dynamic Search, Filtering & Sorting:** Instantly search exercises by name or muscle group tags (`CHEST`, `ARMS`, `LEGS`) and sort dynamically by **Duration**, **Calories**, or **Rating**.
3. **📅 Today's Plan & Saved Workouts Management:** Add lifts directly to "Today's Plan" (with a maximum cap of 5 lifts) or save them for later. Interactive navbar counters dynamically reflect saved and planned items.
4. **📊 Live Metrics Dashboard:** View real-time aggregated metrics (Total Exercises, Minutes, and Calories) on the `/my-plan` page that update instantly as you add, mark as done, or remove workouts.
5. **💾 LocalStorage Persistence & Interactive Toasts:** All plan states survive page reloads and browser refreshes with clear visual feedback provided via contextual toast notifications.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)
- **API:** Custom Fitlog Worker API (`https://api.abcz.workers.dev/api/fitlog`)
