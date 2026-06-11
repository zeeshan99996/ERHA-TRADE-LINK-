import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 size-80 rounded-full gradient-brand opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-80 rounded-full bg-cyan opacity-30 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan">Limited Time</span>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                Upgrade Your <span className="text-gradient-brand">Tech Lifestyle</span>
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                Save up to 40% on flagship earbuds, watches, and gaming gear. New drops every week.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold shadow-glow transition hover:scale-[1.02]">
                View Collection <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
                alt="Premium headphones"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}