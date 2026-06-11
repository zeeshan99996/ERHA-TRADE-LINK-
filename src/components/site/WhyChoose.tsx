import { Award, Truck, Lock, Smile } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const features = [
  { icon: Award, title: "Premium Quality", desc: "Every product is hand-tested by our QA team before it ships." },
  { icon: Truck, title: "Fast Delivery", desc: "Same-day dispatch and 1-3 day nationwide delivery." },
  { icon: Lock, title: "Secure Payments", desc: "256-bit SSL checkout, COD, JazzCash and bank transfer." },
  { icon: Smile, title: "Customer Satisfaction", desc: "50,000+ happy customers and a 4.9 average rating." },
];

export function WhyChoose() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Why ERHA" title="Why choose ERHA Trade Link" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand">
              <div className="absolute -right-8 -top-8 size-24 rounded-full gradient-brand opacity-10 transition group-hover:scale-150" />
              <div className="relative grid size-12 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                <f.icon className="size-6" />
              </div>
              <h3 className="relative mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}