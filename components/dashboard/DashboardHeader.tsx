import Image from "next/image";

export function DashboardHeader() {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/80 bg-white py-3 px-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950 header-section">
      <div className="flex flex-row items-center justify-between gap-6 header-layout">
        <div className="flex-1 w-full xl:max-w-[500px]">
          <h2 className="text-[44px] font-bold leading-tight font-sans">
            <span className="text-black dark:text-white">Good Morning,</span>
            <span className="text-emerald-600"> Priya!</span>
            <span className="inline-block ml-1">👋</span>
          </h2>
          <p className="mt-1 text-[18px] font-medium text-gray-500 dark:text-slate-300 leading-relaxed">
            Here&apos;s what&apos;s happening with your health and subscriptions.
          </p>
        </div>

        <div className="w-full md:w-auto xl:w-[40%] flex items-center justify-center xl:justify-end">
          <div className="relative w-full md:w-[300px] xl:w-full h-auto min-h-[140px] flex items-center justify-center xl:justify-end">
            <Image 
              src="/images/premium-hero-final.png" 
              alt="Healthcare illustration" 
              width={400}
              height={400}
              className="w-full h-auto max-h-[150px] xl:max-h-[165px] object-contain animate-float drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
