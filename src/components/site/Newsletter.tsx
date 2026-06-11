import { Mail, ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
          <div className="absolute -right-20 -top-20 size-60 rounded-full gradient-brand opacity-20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="inline-flex size-12 items-center justify-center rounded-xl gradient-brand text-white shadow-glow">
                <Mail className="size-5" />
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">Stay updated with latest gadgets</h2>
              <p className="mt-2 text-muted-foreground">Get exclusive deals, launch alerts, and tech tips — straight to your inbox.</p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input type="email" required placeholder="you@example.com" className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-brand" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]">
                Subscribe <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}