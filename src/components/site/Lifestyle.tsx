import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const tiles = [
  { title: "Travel Tech", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80" },
  { title: "Gaming Setup", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80" },
  { title: "Office Essentials", img: "https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=900&q=80" },
  { title: "Fitness Gadgets", img: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80" },
];

export function Lifestyle() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Curated For You" title="Lifestyle Collection" sub="Tech that fits the way you live." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <a key={t.title} href="#" className="group relative block overflow-hidden rounded-2xl">
              <img src={t.img} alt={t.title} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-white">
                <span className="font-display text-lg font-semibold">{t.title}</span>
                <span className="grid size-9 place-items-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-cyan group-hover:text-secondary">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}