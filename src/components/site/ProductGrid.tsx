import { SectionHeading } from "./SectionHeading";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductGrid({ eyebrow, title, sub, items, centered }: { eyebrow?: string; title: string; sub?: string; items: Product[]; centered?: boolean }) {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          sub={sub}
          centered={centered}
          action={
            <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">
              Shop all <ArrowRight className="size-4" />
            </a>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}