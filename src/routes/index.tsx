import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrustBadges } from "@/components/site/TrustBadges";
import { Categories } from "@/components/site/Categories";
import { ProductGrid } from "@/components/site/ProductGrid";
import { PromoBanner } from "@/components/site/PromoBanner";

import { WhyChoose } from "@/components/site/WhyChoose";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ERHA Trade Link — Premium Electronics & Gadgets Store in Pakistan" },
      { name: "description", content: "Shop premium wireless earbuds, smart watches, power banks, Bluetooth speakers, chargers and gaming accessories at ERHA Trade Link." },
      { property: "og:title", content: "ERHA Trade Link — Premium Electronics" },
      { property: "og:description", content: "Pakistan's trusted destination for premium electronics and gadgets." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 8);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <Categories />
        <ProductGrid title="OUR PRODUCTS" items={featured} centered />
        <PromoBanner />
        <WhyChoose />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
