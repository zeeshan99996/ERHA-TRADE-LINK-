import { Target, Eye, Heart } from "lucide-react";

export function About() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl gradient-brand opacity-20 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1100&q=80"
            alt="ERHA team"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-soft"
          />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">About Us</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Pakistan's trusted <span className="text-gradient-brand">electronics</span> store
          </h2>
          <p className="mt-4 text-muted-foreground">
            Since 2019, ERHA Trade Link has been delivering premium gadgets and accessories to homes, offices and creators across Pakistan. We obsess over quality, service and the small details that make tech feel effortless.
          </p>

          <div className="mt-6 space-y-4">
            <Pillar icon={Target} title="Our Mission" desc="To make premium technology accessible, affordable and effortless for every household." />
            <Pillar icon={Eye} title="Our Vision" desc="To become South Asia's most loved electronics destination, powered by trust and innovation." />
            <Pillar icon={Heart} title="Our Promise" desc="Authentic products, honest pricing, and human support — every single order." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl gradient-brand text-white">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="font-display font-semibold text-ink">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}