import { ArrowRight, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PromoBanner() {
  return (
    <section className="bg-background py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-secondary p-6 sm:p-10 lg:p-16 text-white">
          <div className="absolute -right-20 -top-20 size-80 rounded-full gradient-brand opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-80 rounded-full bg-cyan opacity-30 blur-3xl" />

          <div className="relative grid items-center gap-6 sm:gap-8 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan">Limited Time Deal</span>
              <h2 className="mt-3 sm:mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Power Up with <span className="text-gradient-brand">ERHA</span>
              </h2>
              <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-white/70">
                Save up to 40% on premium power banks. From 5,000mAh pocket chargers to 50,000mAh power stations — we have a bank for every need.
              </p>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-semibold shadow-glow transition hover:scale-[1.02] cursor-pointer"
                >
                  Shop Now <ArrowRight className="size-4" />
                </Link>
                <a
                  href="https://wa.me/923023333499"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  WhatsApp Order
                </a>
              </div>
              {/* Contact strip */}
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/60">
                <span>📞 0302-3333499</span>
                <span>📍 Multan, Pakistan</span>
                <span>🚚 Free delivery on Rs. 2,999+</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"
                alt="ERHA Power Banks"
                className="w-full rounded-2xl object-cover shadow-glow aspect-[4/3] sm:aspect-[16/10]"
              />
              {/* Price badge */}
              <div className="absolute -top-3 -right-3 sm:top-4 sm:right-4 flex items-center gap-1 bg-cyan text-secondary text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                <Zap className="size-3.5" /> From Rs. 1,499
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}