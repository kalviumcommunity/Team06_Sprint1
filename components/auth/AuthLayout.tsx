import { ReactNode } from "react";
import LeftPanel from "./LeftPanel";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <main className="min-h-screen bg-slate-100 transition-colors duration-300 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <LeftPanel />

        {/* Right Side */}
        <section className="flex items-center justify-center p-6 lg:p-12">
          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              bg-white
              p-10
              shadow-2xl
              transition-colors
              duration-300

              dark:border
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}