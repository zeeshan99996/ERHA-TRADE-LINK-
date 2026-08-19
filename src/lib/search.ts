export function matchesSearchQuery(product: any, query: string): boolean {
  if (!product) return false;
  if (!query || !query.trim()) return true;

  const rawQ = query.toLowerCase().trim();
  const name = String(product.name || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();
  const desc = String(product.shortDescription || product.description || "").toLowerCase();
  const brand = String(product.brand || "").toLowerCase();
  const sku = String(product.sku || "").toLowerCase();
  const allText = `${name} ${category} ${desc} ${brand} ${sku}`.toLowerCase();

  // Stem helper
  const stem = (w: string) => w.replace(/(?:s|es|ies)$/i, "").toLowerCase();

  // 1. Is this query specifically for Power Banks / Charging?
  const isPowerQuery =
    rawQ.includes("power") ||
    rawQ.includes("bank") ||
    rawQ.includes("battery") ||
    rawQ.includes("pzx") ||
    rawQ.includes("10000") ||
    rawQ.includes("mah");

  // 2. Is this query specifically for Earbuds / Audio / Headphones?
  const isEarbudQuery =
    rawQ.includes("ear") ||
    rawQ.includes("bud") ||
    rawQ.includes("airpod") ||
    rawQ.includes("headphone") ||
    rawQ.includes("zoro") ||
    rawQ.includes("tltm") ||
    rawQ.includes("anc") ||
    rawQ.includes("enc") ||
    rawQ.includes("tws") ||
    rawQ.includes("audio");

  if (isPowerQuery && !isEarbudQuery) {
    return (
      name.includes("power bank") ||
      name.includes("power") ||
      name.includes("bank") ||
      category.includes("compact") ||
      category.includes("power")
    );
  }

  if (isEarbudQuery && !isPowerQuery) {
    return (
      name.includes("earbud") ||
      name.includes("earbuds") ||
      name.includes("wireless") ||
      name.includes("bluetooth") ||
      category.includes("earbuds") ||
      category.includes("audio")
    );
  }

  // 3. Multi-word token matching with stemming
  const words = rawQ.split(/\s+/).filter(Boolean);
  return words.every((w) => {
    const s = stem(w);
    return allText.includes(w) || (s.length >= 3 && allText.includes(s));
  });
}

export function matchesCategoryQuery(product: any, cat: string): boolean {
  if (!cat || cat === "All") return true;
  const c = cat.toLowerCase();
  const pCat = String(product.category || "").toLowerCase();
  const pName = String(product.name || "").toLowerCase();

  if (c.includes("power")) {
    return pCat.includes("power") || pCat.includes("compact") || pName.includes("power") || pName.includes("bank");
  }
  if (c.includes("earbud")) {
    return pCat.includes("earbuds") || pName.includes("earbuds") || pName.includes("earbud");
  }
  return pCat.includes(c);
}
