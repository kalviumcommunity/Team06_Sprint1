"use client";

import Link from "next/link";
import { ShieldCheck, Bell, Truck, Pill } from "lucide-react";

export default function LeftPanel() {
  return (
    <section
      className="
        hidden
        lg:flex
        flex-col
        justify-between
        bg-gradient-to-br
        from-teal-600
        via-cyan-600
        to-sky-700
        p-12
        text-white
        transition-colors
        duration-300
      "
    >
      {/* Logo */}

      <div>
        <Link
          href="/"
          className="text-4xl font-bold tracking-wide"
        >
          PharmaEase
        </Link>

        <p className="mt-2 text-lg text-white/90">
          Smart Medicine Subscription Platform
        </p>
      </div>

      {/* Hero */}

      <div className="space-y-8">

        <div>

          <h1 className="text-5xl font-bold leading-tight">
            Never Miss Your Medicines Again
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/90">
            PharmaEase helps you manage medicine subscriptions,
            automatic refills, smart reminders, secure online
            payments, and doorstep delivery—all in one place.
          </p>

        </div>

        {/* Feature Cards */}

        <div className="grid grid-cols-2 gap-5">

          <div
            className="
              rounded-2xl
              bg-white/10
              p-5
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white/20
            "
          >
            <Pill size={30} />

            <h3 className="mt-4 font-semibold">
              Auto Refills
            </h3>
          </div>

          <div
            className="
              rounded-2xl
              bg-white/10
              p-5
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white/20
            "
          >
            <Bell size={30} />

            <h3 className="mt-4 font-semibold">
              Smart Reminders
            </h3>
          </div>

          <div
            className="
              rounded-2xl
              bg-white/10
              p-5
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white/20
            "
          >
            <Truck size={30} />

            <h3 className="mt-4 font-semibold">
              Fast Delivery
            </h3>
          </div>

          <div
            className="
              rounded-2xl
              bg-white/10
              p-5
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white/20
            "
          >
            <ShieldCheck size={30} />

            <h3 className="mt-4 font-semibold">
              Secure Payments
            </h3>
          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="text-sm text-white/80">
        © 2026 PharmaEase. All rights reserved.
      </div>
    </section>
  );
}