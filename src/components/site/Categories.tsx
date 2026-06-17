import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { db } from "@/lib/supabase";
import { SectionHeading } from "./SectionHeading";
import { Link } from "@tanstack/react-router";
import {
  BatteryCharging, Zap, Laptop, Sun, ArrowRight,
  Smartphone
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  "battery-charging": BatteryCharging,
  zap: Zap,
  cable: Sun,
  laptop: Laptop,
};

// Extra visual data per category
const categoryMeta: Record<string, { color: string; desc: string }> = {
  "Ultra Compact": { color: "from-violet-500 to-indigo-500", desc: "Pocket-sized chargers" },
  "High Capacity": { color: "from-blue-500 to-cyan-500", desc: "50,000mAh+ powerhouses" },
  "MagSafe & Wireless": { color: "from-pink-500 to-rose-500", desc: "No cables needed" },
  "Laptop Power Banks": { color: "from-amber-500 to-orange-500", desc: "65W–140W PD output" },
  "Rugged & Solar": { color: "from-green-500 to-emerald-500", desc: "IP67 & solar charging" },
};

export function Categories() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      const cats = await db.getCategories();
      setCategoriesList(cats);
    };
    loadCats();
    window.addEventListener("storage", loadCats);
    return () => window.removeEventListener("storage", loadCats);
  }, []);

  return (
    <section id="categories" className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Shop By Category"
          title="Power banks for every need"
          sub="From everyday pocket chargers to heavy-duty solar power stations — find your perfect match."
          action={
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />

        {/* Cards grid — 1 col on mobile, 3 on sm, 5 on lg */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoriesList.map((c, i) => {
            const Icon = iconMap[c.icon || "smartphone"] ?? BatteryCharging;
            const meta = categoryMeta[c.name] ?? { color: "from-indigo-500 to-violet-500", desc: "Power banks" };
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to="/shop"
                  search={{ category: c.name }}
                  className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 text-center shadow-soft transition hover:-translate-y-1 hover:border-brand hover:shadow-glow overflow-hidden block h-full cursor-pointer"
                >
                  {/* Subtle gradient bg on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  {/* Icon circle */}
                  <div className="relative grid size-14 sm:size-16 place-items-center rounded-full bg-muted transition group-hover:bg-transparent">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${meta.color} opacity-0 transition group-hover:opacity-100`} />
                    <Icon className="relative size-6 sm:size-7 text-ink transition group-hover:text-white" />
                  </div>

                  <div className="relative">
                    <div className="text-xs sm:text-sm font-semibold leading-tight text-ink group-hover:text-brand transition">{c.name}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{meta.desc}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}