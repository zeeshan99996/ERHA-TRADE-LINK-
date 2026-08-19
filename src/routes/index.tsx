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
  loader: async () => {
    try {
      const prods = await db.getProducts();
      return { products: (prods || []).filter((p: any) => p && (p.status === "Active" || !p.status)) };
    } catch {
      return { products: [] };
    }
  },
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

function Index() {
  const loaderData = Route.useLoaderData() as { products: any[] } | undefined;
  const [featured, setFeatured] = useState<any[]>(loaderData?.products || []);

  useEffect(() => {
    const loadProducts = async () => {
      const prods = await db.getProducts();
      const active = (prods || []).filter((p: any) => p && (p.status === "Active" || !p.status));
      setFeatured(active);
    };
    if (!loaderData?.products || loaderData.products.length === 0) {
      loadProducts();
    }
    window.addEventListener("storage", loadProducts);
    return () => window.removeEventListener("storage", loadProducts);
  }, [loaderData]);

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
