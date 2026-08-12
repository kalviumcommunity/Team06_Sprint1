"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section
      className="
        py-20

        bg-gradient-to-r
        from-teal-600
        via-cyan-600
        to-blue-700

        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950

        transition-colors
        duration-300
      "
    >
      <div className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Ready to Simplify Your Medicine Refills?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-teal-100 dark:text-slate-300">
          Join thousands of users who trust PharmaEase to manage their
          medicine subscriptions with automatic refills, smart reminders,
          secure online payments, and doorstep medicine delivery.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/register"
            className="
              rounded-xl
              bg-white
              px-8
              py-4
              font-semibold
              text-teal-700
              transition-all

              hover:scale-105
              hover:bg-slate-100

              dark:bg-slate-800
              dark:text-white
              dark:hover:bg-slate-700
            "
          >
            Get Started
          </Link>

          <Link
            href="/medicines"
            className="
              flex
              items-center
              gap-2

              rounded-xl
              border
              border-white

              px-8
              py-4

              font-semibold
              text-white

              transition-all

              hover:bg-white
              hover:text-teal-700

              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Browse Medicines
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    </section>
  );
}