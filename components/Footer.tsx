import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 py-10 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-2xl">
              💊
            </div>

            <div>
              <h2 className="text-xl font-bold">PharmaEase</h2>
              <p className="text-sm text-slate-400">
                Smart Medicine Subscription Platform
              </p>
            </div>
          </div>

          {/* Quick Links */}

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">

            <Link
              href="/"
              className="transition hover:text-teal-400"
            >
              Home
            </Link>

            <Link
              href="/login"
              className="transition hover:text-teal-400"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="transition hover:text-teal-400"
            >
              Register
            </Link>

            <Link
              href="/dashboard/medicines"
              className="transition hover:text-teal-400"
            >
              Medicines
            </Link>

          </div>

        </div>

        <div className="mt-8 border-t border-slate-700 pt-6 text-center">

          <p className="text-sm text-slate-400">
            © 2026 PharmaEase. All rights reserved.
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Your trusted healthcare partner for medicine subscriptions,
            automatic refills, and doorstep delivery.
          </p>

        </div>

      </div>
    </footer>
  );
}