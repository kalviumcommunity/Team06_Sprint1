"use client";

export default function Features() {
  const features = [
    {
      title: "Medicine Subscription",
      description:
        "Subscribe to your daily medicines and receive them automatically based on your selected schedule.",
      icon: "💊",
    },
    {
      title: "Automatic Refills",
      description:
        "Never run out of medicines. PharmaEase automatically generates refill orders before your stock finishes.",
      icon: "🔄",
    },
    {
      title: "Smart Reminders",
      description:
        "Receive timely reminders before every refill and medicine delivery.",
      icon: "🔔",
    },
    {
      title: "Secure Payments",
      description:
        "Pay safely using UPI, Credit Card, Debit Card, Net Banking or Cash on Delivery.",
      icon: "💳",
    },
    {
      title: "Doorstep Delivery",
      description:
        "Get medicines delivered directly to your home with real-time delivery tracking.",
      icon: "🚚",
    },
    {
      title: "24/7 Customer Support",
      description:
        "Our support team is always available to help with subscriptions and medicine-related queries.",
      icon: "🩺",
    },
  ];

  return (
    <section
      id="features"
      className="
        bg-white
        py-20
        transition-colors
        duration-300

        dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">

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
            Why Choose PharmaEase?
          </h2>

          <p
            className="
              mt-4
              text-lg

              text-slate-600

              dark:text-slate-300
            "
          >
            A smarter way to manage your medicines, subscriptions,
            refills, reminders and deliveries.
          </p>

        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-8
                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-2
                hover:shadow-xl

                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <div className="mb-6 text-5xl">
                {feature.icon}
              </div>

              <h3
                className="
                  mb-3
                  text-2xl
                  font-semibold

                  text-slate-900

                  dark:text-white
                "
              >
                {feature.title}
              </h3>

              <p
                className="
                  leading-7

                  text-slate-600

                  dark:text-slate-300
                "
              >
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}