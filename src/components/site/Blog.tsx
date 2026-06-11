import { SectionHeading } from "./SectionHeading";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  { title: "5 Wireless Earbuds Worth Buying in 2026", date: "Jun 02, 2026", tag: "Audio", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80" },
  { title: "Smart Watches: A Buyer's Guide for Beginners", date: "May 28, 2026", tag: "Wearables", img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80" },
  { title: "GaN Chargers Explained: Why You Should Switch", date: "May 19, 2026", tag: "Charging", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80" },
  { title: "Build the Ultimate Mobile Gaming Setup", date: "May 11, 2026", tag: "Gaming", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80" },
];

export function Blog() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="From the Blog"
          title="Latest technology articles"
          sub="Guides, reviews and deep-dives from our editorial team."
          action={<a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">Read all <ArrowRight className="size-4" /></a>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p) => (
            <a key={p.title} href="#" className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="size-full object-cover transition duration-500 group-hover:scale-110" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">{p.tag}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" /> {p.date}
                </div>
                <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold text-ink transition group-hover:text-brand">{p.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}