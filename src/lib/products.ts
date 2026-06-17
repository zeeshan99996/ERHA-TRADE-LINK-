export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
};

export const products: Product[] = [];

export const categories: any[] = [];