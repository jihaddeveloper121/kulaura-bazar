export type ProductUnit =
  | "kg"
  | "gram"
  | "liter"
  | "piece"
  | "packet"
  | "box"
  | "bottle";

export type ProductStatus = "active" | "archived";

export type Product = {
  id: number;

  name: string;
  shortText: string;

  category: string;
  section: string;
  productType: string;
  brand?: string;

  image: string;
  images?: string[];
  primaryImage?: string;

  price: number;
  oldPrice: number | null;

  unit: ProductUnit;
  step: number;
  minQuantity: number;
  defaultQuantity: number;
  maxQuantity: number;

  quantityOptions?: number[];
  quantityPrices?: Record<number, number>;
  quantityOldPrices?: Record<number, number>;

  stock: number;
  verified: boolean;
  status: ProductStatus;

  description: string;
  keywords: string[];

  returnPolicy: string;

  monthlyBazar: boolean;
  discountProduct: boolean;
  suggestedProduct: boolean;

  searchTerms: string[];

  quality?: string;
  color?: string;
  returnable?: boolean;
  returnNote?: string;
};