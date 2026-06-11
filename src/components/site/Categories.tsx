import { motion } from "motion/react";
import { categories } from "@/lib/products";
import { SectionHeading } from "./SectionHeading";
import { Headphones, Watch, BatteryCharging, Speaker, Zap, Gamepad2, Smartphone, Cable, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  headphones: Headphones,
  watch: Watch,
  "battery-charging": BatteryCharging,
  speaker: Speaker,
  zap: Zap,
  "gamepad-2": Gamepad2,
  smartphone: Smartphone,
  cable: Cable,
};

export function Categories() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Shop By Category"
          title="Find what powers your day"
          sub="From all-day earbuds to gaming-grade gear — explore curated categories."
          action={
            <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">
              View all <ArrowRight className="size-4" />
            </a>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c, i) => {
            const Icon = iconMap[c.icon] ?? Headphones;
            return (
              <motion.a
                key={c.name}
                href="#"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition hover:-translate-y-1 hover:border-brand hover:shadow-glow"
              >
                <div className="relative grid size-16 place-items-center rounded-full bg-muted transition group-hover:bg-transparent">
                  <div className="absolute inset-0 rounded-full gradient-brand opacity-0 transition group-hover:opacity-100" />
                  <Icon className="relative size-7 text-ink transition group-hover:text-white" />
                </div>
                <div className="text-xs font-medium leading-tight text-ink">{c.name}</div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}