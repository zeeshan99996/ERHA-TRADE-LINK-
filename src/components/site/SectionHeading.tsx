import { motion } from "motion/react";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  centered,
  compact,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  centered?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`mb-6 flex flex-wrap items-end gap-4 sm:mb-8 ${centered ? "justify-center text-center" : "justify-between"}`}
    >
      <div className={`w-full ${centered ? "flex flex-col items-center" : ""}`}>
        {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</div>}
        <h2
          className={`font-display font-black text-ink tracking-tight leading-[1.1] ${
            compact
              ? "text-lg sm:text-xl lg:text-2xl"
              : "text-4xl sm:text-5xl lg:text-6xl"
          }`}
        >
          {title}
        </h2>
        {sub && <p className="mt-2 max-w-2xl text-muted-foreground">{sub}</p>}
      </div>
      {!centered && action}
    </motion.div>
  );
}