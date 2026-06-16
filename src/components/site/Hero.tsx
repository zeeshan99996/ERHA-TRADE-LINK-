import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const slides = [
  {
    eyebrow: "New 2026 Collection",
    title: "Never Run Out of Power",
    sub: "Ultra-fast charging power banks from 5,000mAh to 50,000mAh — engineered for every journey.",
    cta: "Shop Power Banks",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1400&q=80",
    tag: "ERHA PowerCore 20000",
    price: "Rs. 3,499",
  },
  {
    eyebrow: "MagSafe & Wireless",
    title: "Snap, Charge & Go",
    sub: "Next-gen magnetic power banks that wirelessly fast-charge your iPhone and Android devices.",
    cta: "View MagSafe Banks",
    image: "https://images.unsplash.com/photo-1609592424083-d5d14dfc949a?auto=format&fit=crop&w=1400&q=80",
    tag: "ERHA SlimPower MagSafe",
    price: "Rs. 2,499",
  },
  {
    eyebrow: "Rugged & Solar",
    title: "Power for the Wild",
    sub: "IP67 waterproof, shockproof solar power banks built for outdoor adventures and emergencies.",
    cta: "Explore Solar Banks",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=1400&q=80",
    tag: "ERHA SolarVolt 12000",
    price: "Rs. 2,999",
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];

  return (
    <section className="relative overflow-hidden bg-secondary text-white h-[55vh] sm:h-[65vh] lg:h-[80vh] w-full">
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20 z-10">
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-brand blur-[120px]" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-cyan blur-[120px]" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 mx-auto max-w-7xl h-full flex items-end pb-8 sm:pb-14 px-4 sm:px-6">
        <motion.div
          key={`c-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/50 border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-md text-white flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 w-full sm:max-w-xl shadow-glow"
        >
          <div className="flex-1 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan mb-1">
              <Sparkles className="size-3" /> {s.eyebrow}
            </span>
            <div className="font-display font-bold text-base sm:text-xl leading-snug">{s.tag}</div>
            <div className="text-xs sm:text-sm font-semibold text-cyan/90 mt-0.5">Starting from {s.price}</div>
            <p className="text-xs text-white/60 mt-1 line-clamp-2 hidden sm:block">{s.sub}</p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold text-white shadow-glow transition hover:scale-[1.02] cursor-pointer"
            >
              {s.cta} <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to="/shop"
              search={{ category: "Ultra Compact" }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer"
            >
              Deals
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows — hidden on mobile */}
      <button
        onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 inline-flex size-10 sm:size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur hover:bg-white/10 transition max-sm:hidden cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => setI((p) => (p + 1) % slides.length)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 inline-flex size-10 sm:size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur hover:bg-white/10 transition max-sm:hidden cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Slide Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-8 bg-cyan" : "w-2 bg-white/40"} cursor-pointer`}
            aria-label={`Slide ${k + 1}`}
          />
        ))}
      </div>
    </section>
  );
}