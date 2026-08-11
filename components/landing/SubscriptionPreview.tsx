"use client";

import {
  Bell,
  CalendarDays,
  CreditCard,
  Pill,
  RefreshCw,
  Truck,
} from "lucide-react";

export default function SubscriptionPreview() {
  return (
    <div className="relative flex w-full min-h-[540px] sm:min-h-[620px] lg:h-[650px] items-center justify-center overflow-hidden px-4">

      {/* Background Glow */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-10 top-24 h-44 w-44 rounded-full bg-cyan-300/20 blur-[120px] dark:bg-cyan-500/10" />

        <div className="absolute right-10 bottom-16 h-44 w-44 rounded-full bg-teal-300/20 blur-[120px] dark:bg-teal-500/10" />

      </div>

      {/* Left Connector */}

      <svg
        className="absolute left-12 bottom-40 hidden lg:block"
        width="180"
        height="130"
        viewBox="0 0 180 130"
      >
        <path
          d="M0 65 C60 65 80 15 180 15"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="2"
          strokeDasharray="7 7"
        />
      </svg>

      {/* Right Connector */}

      <svg
        className="absolute right-12 bottom-40 hidden lg:block"
        width="180"
        height="130"
        viewBox="0 0 180 130"
      >
        <path
          d="M180 65 C120 65 100 15 0 15"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="2"
          strokeDasharray="7 7"
        />
      </svg>

      {/* Smart Reminder */}

      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">

        <div className="
          flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24
          items-center justify-center
          rounded-full
          border-2 border-cyan-200
          bg-white
          shadow-[0_0_40px_rgba(45,212,191,0.30)]
          transition

          dark:border-cyan-700
          dark:bg-slate-900
        ">
          <Bell className="h-7 w-7 lg:h-9 lg:w-9 text-teal-600 dark:text-teal-400" />
        </div>

        <h3 className="mt-3 text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
          Smart Reminder
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Notifications
        </p>

      </div>

      {/* Vertical Line */}

      <div className="absolute top-24 sm:top-28 h-16 border-l-2 border-dashed border-teal-300 dark:border-teal-600" />

      {/* Main Card */}

      <div
        className="
        relative
        mt-20
        w-full
        max-w-[340px]
        rounded-[32px]

        border
        border-teal-100

        bg-white

        p-7

        shadow-[0_25px_60px_rgba(0,0,0,0.12)]

        transition-all

        hover:-translate-y-2

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)]
      "
      >

        {/* Medicine */}

        <div className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-teal-50 dark:hover:bg-slate-800">

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 p-3">
            <Pill className="text-teal-600 dark:text-teal-400" />
          </div>

          <div>

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Medicine
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Essential medicines
            </p>

          </div>

        </div>

        <hr className="my-5 border-slate-200 dark:border-slate-700" />

        {/* Subscription */}

        <div className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-teal-50 dark:hover:bg-slate-800">

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 p-3">
            <CalendarDays className="text-teal-600 dark:text-teal-400" />
          </div>

          <div>

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Subscription
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monthly Auto Renewal
            </p>

          </div>

        </div>

        <hr className="my-5 border-slate-200 dark:border-slate-700" />

        {/* Delivery */}

        <div className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-teal-50 dark:hover:bg-slate-800">

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 p-3">
            <Truck className="text-teal-600 dark:text-teal-400" />
          </div>

          <div>

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Delivery
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Doorstep Delivery
            </p>

          </div>

        </div>

        <hr className="my-5 border-slate-200 dark:border-slate-700" />

        {/* Payment */}

        <div className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-teal-50 dark:hover:bg-slate-800">

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-slate-800 dark:to-slate-700 p-3">
            <CreditCard className="text-teal-600 dark:text-teal-400" />
          </div>

          <div>

            <h4 className="font-semibold text-slate-900 dark:text-white">
              Payment
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Secure Online Payment
            </p>

          </div>

        </div>

      </div>

      {/* Bottom Left */}

      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 lg:bottom-16 lg:left-4 flex flex-col items-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-200 bg-white dark:bg-slate-900 dark:border-cyan-700">

          <RefreshCw className="h-7 w-7 animate-spin text-teal-600 dark:text-teal-400 [animation-duration:8s]" />

        </div>

        <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          Auto Refill
        </h3>

      </div>

      {/* Bottom Right */}

      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-16 lg:right-4 flex flex-col items-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-200 bg-white dark:bg-slate-900 dark:border-cyan-700">

          <Truck className="h-7 w-7 text-teal-600 dark:text-teal-400" />

        </div>

        <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
          Fast Delivery
        </h3>

      </div>

    </div>
  );
}