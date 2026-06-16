import { Mail, ArrowRight, MessageCircle } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft">
          <div className="absolute -right-20 -top-20 size-60 rounded-full gradient-brand opacity-20 blur-3xl" />
          <div className="relative grid items-center gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <div className="inline-flex size-11 sm:size-12 items-center justify-center rounded-xl gradient-brand text-white shadow-glow">
                <Mail className="size-5" />
              </div>
              <h2 className="mt-3 sm:mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                Stay updated with latest power banks
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Get exclusive deals, new arrival alerts, and tech tips from ERHA Trade Link International — straight to your inbox.
              </p>
              {/* WhatsApp alternative */}
              <a
                href="https://wa.me/923023333499"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                <MessageCircle className="size-4" /> Or WhatsApp us at 0302-3333499
              </a>
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-full border border-border bg-background px-5 py-3 sm:py-3.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full gradient-brand px-6 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                Subscribe <ArrowRight className="size-4" />
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                No spam. Unsubscribe any time. Your email stays private.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}