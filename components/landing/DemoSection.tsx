"use client";

import { ArrowRight, Pill } from "lucide-react";
import Link from "next/link";

export default function DemoSection() {
  return (
    <section
      id="demo"
      className="
        py-24
        text-white

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
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span
            className="
              rounded-full
              bg-white/20
              px-5
              py-2
              text-sm
              font-semibold

              backdrop-blur

              dark:bg-white/10
            "
          >
            PharmaEase Experience
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Discover Smart Medicine Subscription
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-cyan-100 dark:text-slate-300">
            Explore medicines, create subscriptions, schedule automatic
            refills, receive reminders, and enjoy hassle-free doorstep
            medicine delivery.
          </p>

        </div>

        {/* Buttons */}

        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

          <Link
            href="/medicines"
            className="
              flex
              items-center
              gap-3

              rounded-xl

              bg-white

              px-8
              py-4

              font-semibold

              text-teal-700

              transition-all
              duration-300

              hover:scale-105
              hover:bg-slate-100

              dark:bg-slate-800
              dark:text-white
              dark:hover:bg-slate-700
            "
          >
            <Pill size={22} />
            Explore Medicines
          </Link>

          <Link
            href="/register"
            className="
              flex
              items-center
              gap-3

              rounded-xl

              border
              border-white

              px-8
              py-4

              font-semibold

              transition-all
              duration-300

              hover:bg-white
              hover:text-teal-700

              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>

        </div>

        {/* Feature Cards */}

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              icon: "💊",
              title: "Browse Medicines",
              desc: "Search medicines by category, manufacturer, or prescription type.",
            },
            {
              icon: "📅",
              title: "Subscribe Easily",
              desc: "Choose Daily, Weekly, or Monthly medicine subscriptions.",
            },
            {
              icon: "🔔",
              title: "Smart Reminders",
              desc: "Receive refill reminders before your medicines run out.",
            },
            {
              icon: "🚚",
              title: "Fast Delivery",
              desc: "Track every refill order until it reaches your doorstep safely.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                rounded-2xl

                border
                border-white/20

                bg-white/10

                p-6

                backdrop-blur-lg

                transition-all
                duration-300

                hover:-translate-y-2
                hover:bg-white/20

                dark:border-slate-700
                dark:bg-slate-900/40
                dark:hover:bg-slate-800/70
              "
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="mt-4 text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-cyan-100 dark:text-slate-300">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}