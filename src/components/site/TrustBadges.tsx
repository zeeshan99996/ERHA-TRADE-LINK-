import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { motion } from "motion/react";

const badges = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 2,999" },
  { icon: ShieldCheck, title: "1 Year Warranty", desc: "Brand-authorized coverage" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Headphones, title: "24/7 Support", desc: "0302-3333499 • Real humans" },
];

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-background py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="grid size-10 sm:size-12 shrink-0 place-items-center rounded-lg sm:rounded-xl gradient-brand text-white transition group-hover:scale-110">
                <b.icon className="size-5 sm:size-6" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold text-ink text-xs sm:text-sm leading-tight">{b.title}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-tight">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}