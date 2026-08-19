import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { CategoryMarquee } from "@/components/site/CategoryMarquee";
import { ProductGrid } from "@/components/site/ProductGrid";
import { WhyChoose } from "@/components/site/WhyChoose";
import { Footer } from "@/components/site/Footer";
import { useState, useEffect } from "react";
import { db } from "@/lib/supabase";
import { matchesSearchQuery } from "@/lib/search";
import { Sparkles, X } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail || "");
    };
    window.addEventListener("erha_search_query" as any, handleSearch);
    return () => window.removeEventListener("erha_search_query" as any, handleSearch);
  }, []);

  const displayProducts = searchQuery.trim()
    ? featured.filter((p) => matchesSearchQuery(p, searchQuery))
    : featured;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {!searchQuery.trim() && <Hero products={featured} />}
        {!searchQuery.trim() && <CategoryMarquee />}

        {searchQuery.trim() && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
            <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-3 text-xs sm:text-sm text-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-cyan-600 shrink-0" />
                <span>
                  Showing <strong>{displayProducts.length}</strong> {displayProducts.length === 1 ? "product" : "products"} for "<strong>{searchQuery}</strong>"
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("erha_search_query", { detail: "" }));
                    window.dispatchEvent(new CustomEvent("erha_search_reset"));
                  }
                }}
                className="inline-flex items-center gap-1 font-semibold text-cyan-700 hover:text-cyan-900 cursor-pointer"
              >
                <X className="size-4" /> Clear
              </button>
            </div>
          </div>
        )}

        <ProductGrid
          title={searchQuery.trim() ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : "OUR PREMIUM PRODUCTS"}
          items={displayProducts.slice(0, 8)}
          centered
          compact
        />
        <WhyChoose />
      </main>
      <Footer />
    </div>
  );
}
