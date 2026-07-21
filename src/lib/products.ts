export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  salePrice?: number;
  stock: number;
  minStock?: number;
  status: string;
  shortDescription?: string;
  brand?: string;
  sku?: string;
  rating: number;
  reviews: number;
  badge?: string;
  features?: string[];
  specifications?: Record<string, any>;
  costPrice?: number;
  created_at?: string;
};

export const products: Product[] = [];

export const categories: any[] = [];