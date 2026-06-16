import { Award, Truck, Lock, Smile, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { motion } from "motion/react";

const features = [
  { icon: Award, title: "Genuine Products", desc: "All power banks are brand-certified with authentic quality guarantee.", color: "from-violet-500 to-indigo-500" },
  { icon: Truck, title: "Fast Nationwide Delivery", desc: "Same-day dispatch from Multan. 1–3 day delivery across Pakistan.", color: "from-blue-500 to-cyan-500" },
  { icon: Lock, title: "Secure Payments", desc: "JazzCash, EasyPaisa, COD, and bank transfers accepted.", color: "from-amber-500 to-orange-500" },
  { icon: Smile, title: "Trusted by Thousands", desc: "10,000+ happy customers across Pakistan with 4.8★ rating.", color: "from-green-500 to-emerald-500" },
];

export function WhyChoose() {
  return (
    <section id="whychoose" className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Why ERHA" title="Why choose ERHA Trade Link International" />
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand"
            >
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br opacity-10 transition group-hover:scale-150" />
              <div className={`relative grid size-11 sm:size-12 place-items-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-glow`}>
                <f.icon className="size-5 sm:size-6" />
              </div>
              <h3 className="relative mt-4 font-display text-base sm:text-lg font-semibold text-ink">{f.title}</h3>
              <p className="relative mt-2 text-xs sm:text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 rounded-2xl border border-border bg-card p-5 sm:p-6 text-sm">
          <div className="flex items-center gap-2 text-ink font-medium">
            <MapPin className="size-4 text-brand shrink-0" />
            <span className="text-center sm:text-left">Pace N Pace Mall Near Chaseup, Chungi #6, Multan</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <a href="tel:03023333499" className="flex items-center gap-2 font-bold text-brand hover:underline">
            <Phone className="size-4 shrink-0" /> 0302-3333499
          </a>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <a href="https://wa.me/923023333499" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 font-bold text-green-600 hover:underline">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}