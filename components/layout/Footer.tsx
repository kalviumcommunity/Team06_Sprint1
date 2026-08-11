export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 py-10 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <div className="mb-4 flex items-center justify-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-2xl">
            💊
          </div>

          <div>

            <h2 className="text-xl font-bold">
              PharmaEase
            </h2>

            <p className="text-sm text-slate-400">
              Smart Medicine Subscription Platform
            </p>

          </div>

        </div>

        <p className="text-slate-400">
          © 2026 PharmaEase. All rights reserved.
        </p>

      </div>
    </footer>
  );
}