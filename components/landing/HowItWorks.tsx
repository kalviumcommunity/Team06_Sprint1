"use client";

import {
  UserPlus,
  Pill,
  CalendarDays,
  Bell,
  Truck,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description:
      "Register with your details and choose your preferred language.",
  },
  {
    icon: Pill,
    title: "Select Medicines",
    description:
      "Choose the medicines you need for regular use.",
  },
  {
    icon: CalendarDays,
    title: "Choose Frequency",
    description:
      "Set your subscription as Daily, Weekly, or Monthly.",
  },
  {
    icon: Bell,
    title: "Receive Reminders",
    description:
      "Get notified before every refill and delivery.",
  },
  {
    icon: Truck,
    title: "Doorstep Delivery",
    description:
      "Your medicines arrive automatically at your address.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="
        bg-white
        py-20
        transition-colors
        duration-300

        dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            How PharmaEase Works
          </h2>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Get started in just a few simple steps.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-5">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="
                  relative
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm

                  transition-all
                  duration-300

                  hover:-translate-y-2
                  hover:shadow-xl

                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <div
                  className="
                    mx-auto
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full

                    bg-teal-100

                    dark:bg-slate-800
                  "
                >
                  <Icon
                    className="text-teal-600 dark:text-teal-400"
                    size={30}
                  />
                </div>

                <h3 className="text-center text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-center text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>

                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}