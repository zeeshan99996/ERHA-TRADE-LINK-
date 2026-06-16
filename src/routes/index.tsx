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
      { title: "ERHA Trade Link International — Premium Power Banks in Multan, Pakistan" },
      {
        name: "description",
        content:
          "Buy genuine power banks in Multan, Pakistan. ERHA Trade Link International offers MagSafe, Solar, Laptop & Ultra Compact power banks with fast delivery nationwide. Visit us at Pace N Pace Mall, Chungi #6, Multan.",
      },
      { property: "og:title", content: "ERHA Trade Link International — Power Banks Multan" },
      {
        property: "og:description",
        content:
          "Pakistan's trusted power bank store. Shop 5,000mAh to 50,000mAh power banks with JazzCash, EasyPaisa & COD delivery.",
      },
      { name: "keywords", content: "power bank multan, power bank pakistan, erha trade link, magsafe power bank, solar power bank, laptop power bank, portable charger pakistan" },
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
        <ProductGrid
          eyebrow="Our Products"
          title="Premium Power Banks"
          sub="Engineered for speed, built for reliability — every ERHA power bank comes with warranty."
          items={featured}
          centered
        />
        <PromoBanner />
        <WhyChoose />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
