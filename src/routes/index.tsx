import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { CategoryMarquee } from "@/components/site/CategoryMarquee";
import { ProductGrid } from "@/components/site/ProductGrid";
import { WhyChoose } from "@/components/site/WhyChoose";
import { Footer } from "@/components/site/Footer";
import { useState, useEffect } from "react";
import { db } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ERHA Trade Link International — Premium Tech & Accessories in Multan, Pakistan" },
      {
        name: "description",
        content:
          "Buy genuine tech and charging accessories in Multan, Pakistan. ERHA Trade Link International offers premium power banks, wireless earbuds, smartwatches, and chargers with fast delivery nationwide. Visit us at Pace N Pace Mall, Chungi #6, Multan.",
      },
      { property: "og:title", content: "ERHA Trade Link International — Premium Tech Multan" },
      {
        property: "og:description",
        content:
          "Pakistan's trusted tech store. Shop premium power banks, wireless earbuds, smartwatches and charging gear with JazzCash, EasyPaisa & COD delivery.",
      },
      { name: "keywords", content: "power bank multan, wireless earbuds multan, smartwatch pakistan, tech shop multan, erha trade link, magsafe power bank, solar charger, portable charger pakistan" },
    ],
  }),
  component: Index,
} as any);

function sortPzxFirst(items: any[]) {
  if (!items || items.length <= 1) return items;
  const idx = items.findIndex(
    (p) =>
      p &&
      (String(p.id).toLowerCase() === "prd-pzx-v91" ||
        String(p.name).toLowerCase().includes("pzx v91") ||
        String(p.name).toLowerCase().includes("pzx"))
  );
  if (idx > 0) {
    const pzx = items[idx];
    const rest = items.filter((_, i) => i !== idx);
    return [pzx, ...rest];
  }
  return items;
}

function Index() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const prods = await db.getProducts();
      const active = prods.filter((p) => p.status === "Active" || !p.status);
      setFeatured(sortPzxFirst(active));
    };
    loadProducts();
    window.addEventListener("storage", loadProducts);
    return () => window.removeEventListener("storage", loadProducts);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero products={featured} />
        <CategoryMarquee />
        <ProductGrid
          title="OUR PREMIUM PRODUCTS"
          items={featured.slice(0, 8)}
          centered
          compact
        />
        <WhyChoose />
      </main>
      <Footer />
    </div>
  );
}
