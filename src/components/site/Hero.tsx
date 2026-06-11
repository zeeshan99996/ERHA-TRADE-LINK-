import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const slides = [
  {
    eyebrow: "New Collection 2026",
    title: "Experience Pure Sound",
    sub: "Discover next-generation earbuds with crystal-clear audio and all-day battery life.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1400&q=80",
    tag: "Aero Pro Earbuds",
    price: "Rs. 6,499",
  },
  {
    eyebrow: "Smart Living",
    title: "Smart Technology On Your Wrist",
    sub: "Track fitness, calls, and notifications with our premium smart watch collection.",
    cta: "Explore Collection",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
    tag: "Pulse X Watch",
    price: "Rs. 12,999",
  },
  {
    eyebrow: "Power Up",
    title: "Never Run Out of Power",
    sub: "Ultra-fast charging power banks engineered for the people on the move.",
    cta: "View Power Banks",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1400&q=80",
    tag: "Volt 20K",
    price: "Rs. 3,499",
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
    <section className="relative overflow-hidden bg-secondary text-white h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full">
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Background blur decorative blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-20 z-10">
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-brand blur-[120px]" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-cyan blur-[120px]" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 mx-auto max-w-7xl h-full flex items-end pb-10 sm:pb-16 px-4 sm:px-6">
        <motion.div
          key={`c-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/50 border border-white/10 p-5 sm:p-6 rounded-3xl backdrop-blur-md text-white flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 max-w-lg sm:max-w-xl shadow-glow"
        >
          <div className="flex-1 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan mb-1.5">
              <Sparkles className="size-3" /> Featured
            </span>
            <div className="font-display font-bold text-lg sm:text-xl leading-snug">{s.tag}</div>
            <div className="text-xs sm:text-sm font-semibold text-cyan/90 mt-1">Starting from {s.price}</div>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button className="inline-flex items-center gap-1.5 rounded-full gradient-brand px-5 py-3 text-xs font-bold text-white shadow-glow transition hover:scale-[1.02] cursor-pointer">
              {s.cta} <ArrowRight className="size-3.5" />
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4.5 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/10 cursor-pointer">
              View Deals
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Chevron Arrows for Navigation */}
      <button 
        onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)} 
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur hover:bg-white/10 transition max-sm:hidden cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button 
        onClick={() => setI((p) => (p + 1) % slides.length)} 
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white backdrop-blur hover:bg-white/10 transition max-sm:hidden cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
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

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold">{n}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}