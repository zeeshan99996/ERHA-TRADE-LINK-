export function Ambassador() {
  const imgs = [
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80",
  ];
  return (
    <section className="relative overflow-hidden bg-secondary py-20 text-white">
      <div className="pointer-events-none absolute -left-32 top-1/2 size-96 -translate-y-1/2 rounded-full bg-brand blur-[140px] opacity-40" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Community</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
            Trusted by thousands of <span className="text-gradient-brand">tech lovers</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Creators, gamers, professionals and athletes — they all live with ERHA gear. Join a community that demands the best.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div><div className="font-display text-3xl font-bold text-cyan">50K+</div><div className="text-xs text-white/60">Active Customers</div></div>
            <div><div className="font-display text-3xl font-bold text-cyan">4.9★</div><div className="text-xs text-white/60">Verified Reviews</div></div>
            <div><div className="font-display text-3xl font-bold text-cyan">120+</div><div className="text-xs text-white/60">Cities Delivered</div></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {imgs.map((src, i) => (
            <div key={i} className={`overflow-hidden rounded-2xl border border-white/10 ${i % 2 ? "translate-y-6" : ""}`}>
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover transition duration-700 hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}