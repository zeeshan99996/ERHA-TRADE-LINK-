import { motion } from "motion/react";

export function SectionHeading({ eyebrow, title, sub, action, centered }: { eyebrow?: string; title: string; sub?: string; action?: React.ReactNode; centered?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`mb-8 flex flex-wrap items-end gap-4 sm:mb-12 ${centered ? "justify-center text-center" : "justify-between"}`}
    >
      <div className={`w-full ${centered ? "flex flex-col items-center" : ""}`}>
        {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</div>}
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
        {sub && <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>}
      </div>
      {!centered && action}
    </motion.div>
  );
}