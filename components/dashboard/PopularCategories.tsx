"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryItem } from "@/types/dashboard";

interface PopularCategoriesProps {
  items: CategoryItem[];
}

const categoryIcons: Record<string, string> = {
  "Diabetes Care": "💉",
  "Heart Care": "❤️",
  "Immunity Boosters": "🛡️",
  "Pain Relief": "💊",
  "Vitamins & Supplements": "💪",
  "Digestive Care": "🌿",
  "Skin Care": "✨",
  "Women's Health": "🌸",
  "Baby Care": "🍼",
  "Personal Care": "🧴",
  "Ayurvedic Products": "🌱",
  "Medical Devices": "🩺",
};

export function PopularCategories({ items }: PopularCategoriesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#00b386]">Popular Categories</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Browse by health need</h3>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 p-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          No categories available
        </div>
      ) : (
        <>
          {/* First Grid - Always Visible */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {items.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href || "/categories"}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 transition hover:border-[#00b386] hover:bg-[#e6f7f3] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#00b386] dark:hover:bg-[#00b386]/10"
              >
                <span className="text-3xl">{categoryIcons[item.name] || "💊"}</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white text-center">{item.name}</p>
              </Link>
            ))}
          </div>

          {/* Second Grid - Expandable */}
          {items.length > 6 && (
            <>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                  {items.slice(6).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href || "/categories"}
                      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 transition-all duration-300 hover:border-[#00b386] hover:bg-[#e6f7f3] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#00b386] dark:hover:bg-[#00b386]/10 transform ${
                        isExpanded ? "translate-y-0" : "-translate-y-4"
                      }`}
                    >
                      <span className="text-3xl">{categoryIcons[item.name] || "💊"}</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white text-center">{item.name}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-6 inline-block text-sm font-semibold text-[#00b386] transition hover:text-[#009e76] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b386] focus-visible:ring-offset-2 rounded px-1"
              >
                {isExpanded ? "Show Less ↑" : "View All →"}
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}
