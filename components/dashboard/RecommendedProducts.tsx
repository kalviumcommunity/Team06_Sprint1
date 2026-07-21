import type { ProductItem } from "@/types/dashboard";

interface RecommendedProductsProps {
  items: ProductItem[];
}

export function RecommendedProducts({ items }: RecommendedProductsProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:border-slate-800 dark:bg-slate-950 min-w-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Recommended For You</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Browse tailored medicine packs</p>
        </div>
        <a href="/products" className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700">
          View all →
        </a>
      </div>

      <div className="mt-5 flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth">
        {items.map((item) => (
          <article key={item.name} className="min-w-[240px] flex-shrink-0 2xl:flex-1 2xl:min-w-0 snap-start rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_14px_40px_-20px_rgba(15,23,42,0.2)] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-300">{item.tag}</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300">⭐ {item.rating}</span>
            </div>
            <div className="mt-4 flex h-24 items-center justify-center rounded-[1.5rem] bg-white text-slate-700 shadow-sm dark:bg-slate-950">
              <span className="text-xl font-semibold text-slate-500">{item.name.split(" ")[0]}</span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-lg font-semibold text-slate-950 dark:text-white">{item.name}</p>
              <div className="flex items-center gap-3">
                <p className="text-xl font-semibold text-emerald-600">{item.price}</p>
                <p className="text-sm text-slate-500 line-through dark:text-slate-400">{item.originalPrice}</p>
              </div>
              <p className="text-sm text-emerald-700">{item.discount}</p>
            </div>
            <button type="button" className="mt-3 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Subscribe
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
