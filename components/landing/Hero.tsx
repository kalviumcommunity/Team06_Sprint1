"use client";

import Link from "next/link";
import SubscriptionPreview from "./SubscriptionPreview";

export default function Hero() {
  return (
    <section
      className="
        min-h-screen
        bg-gradient-to-br
        from-cyan-50
        via-white
        to-emerald-50
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
        transition-colors
        duration-300
      "
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left Side */}

          <div>
            <span
              className="
                inline-block
                rounded-full
                bg-teal-100
                px-4
                py-2
                text-xs
                font-semibold
                text-teal-700
                dark:bg-teal-900/40
                dark:text-teal-300
                sm:text-sm
              "
            >
              Smart Medicine Subscription Platform
            </span>

            <h1
              className="
                mt-6
                text-4xl
                font-bold
                leading-tight
                text-slate-900
                dark:text-white
                sm:text-5xl
                lg:text-7xl
              "
            >
              Your Smart{" "}
              <span className="text-teal-600 dark:text-teal-400">
                Healthcare Partner
              </span>
            </h1>

            <p
              className="
                mt-6
                text-base
                leading-8
                text-slate-600
                dark:text-slate-300
                sm:text-lg
                lg:text-xl
                lg:leading-9
              "
            >
              Manage your medicine subscriptions, receive automatic refill
              reminders, schedule doorstep deliveries, and never miss an
              important dose with PharmaEase.
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/register"
                className="
                  rounded-xl
                  bg-teal-600
                  px-8
                  py-4
                  text-center
                  font-semibold
                  text-white
                  transition
                  hover:bg-teal-700
                "
              >
                Get Started
              </Link>

              <button
                className="
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-8
                  py-4
                  font-semibold
                  text-slate-900
                  transition
                  hover:bg-slate-100
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                  dark:hover:bg-slate-800
                "
              >
                Explore Medicines
              </button>

            </div>

            {/* Feature Banner */}

            <div
              className="
                mt-8
                rounded-xl
                border
                border-teal-200
                bg-teal-50
                px-4
                py-4
                dark:border-teal-800
                dark:bg-teal-900/20
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-teal-700
                  dark:text-teal-300
                "
              >
                ✔ Designed to simplify medicine subscriptions,
                automatic refills, smart reminders, and doorstep
                medicine delivery.
              </p>
            </div>

            {/* Feature Cards */}

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Card 1 */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  text-center
                  shadow-lg
                  transition-all
                  dark:border
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <h2 className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                  24/7
                </h2>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Medicine Reminders
                </p>
              </div>

              {/* Card 2 */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  text-center
                  shadow-lg
                  transition-all
                  dark:border
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <h2 className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                  Auto
                </h2>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Subscription Refills
                </p>
              </div>

              {/* Card 3 */}

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-6
                  text-center
                  shadow-lg
                  transition-all
                  dark:border
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <h2 className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                  Secure
                </h2>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Online Payments
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">
            <SubscriptionPreview />
          </div>

        </div>
      </div>
    </section>
  );
}