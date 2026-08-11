"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is a Medicine Subscription?",
    answer:
      "A medicine subscription automatically refills and delivers your medicines based on the schedule you choose.",
  },
  {
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes. You can pause, resume, edit, or cancel your subscription anytime from your dashboard.",
  },
  {
    question: "How will I receive reminders?",
    answer:
      "You'll receive reminders through the app, email, and SMS before every scheduled refill.",
  },
  {
    question: "Can I change my language later?",
    answer:
      "Yes. You can change your preferred language anytime from the Settings page.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. Your data is securely stored and protected using industry-standard security practices.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="
        bg-slate-50
        py-20
        transition-colors
        duration-300

        dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-4xl px-6">

        {/* Heading */}

        <div className="text-center">

          <h2
            className="
              text-4xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            Frequently Asked Questions
          </h2>

          <p
            className="
              mt-4
              text-slate-600

              dark:text-slate-300
            "
          >
            Everything you need to know about PharmaEase.
          </p>

        </div>

        {/* FAQ List */}

        <div className="mt-12 space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm

                transition-all
                duration-300

                hover:shadow-lg

                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <button
                type="button"
                onClick={() =>
                  setActive(active === index ? null : index)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6
                  py-5
                  text-left
                "
              >

                <span
                  className="
                    font-semibold
                    text-slate-900

                    dark:text-white
                  "
                >
                  {faq.question}
                </span>

                {active === index ? (
                  <ChevronUp className="text-teal-600 dark:text-teal-400" />
                ) : (
                  <ChevronDown className="text-slate-500 dark:text-slate-400" />
                )}

              </button>

              {active === index && (

                <div
                  className="
                    px-6
                    pb-6

                    text-slate-600

                    dark:text-slate-300
                  "
                >
                  {faq.answer}
                </div>

              )}

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}