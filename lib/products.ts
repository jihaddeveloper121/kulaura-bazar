import type { Product, ProductUnit } from "@/types/product";

export type { Product, ProductUnit } from "@/types/product";

export function formatQuantity(
  quantity: number,
  unit: ProductUnit
): string {
  if (unit === "kg") {
    if (quantity >= 1000) {
      return `${quantity / 1000} kg`;
    }

    return `${quantity} g`;
  }

  if (unit === "gram") {
    if (quantity >= 1000) {
      return `${quantity / 1000} kg`;
    }

    return `${quantity} g`;
  }

  if (unit === "liter") {
    return `${quantity} L`;
  }

  if (unit === "piece") {
    return `${quantity} pcs`;
  }

  if (unit === "packet") {
    return `${quantity} packet`;
  }

  if (unit === "box") {
    return `${quantity} box`;
  }

  if (unit === "bottle") {
    return `${quantity} bottle`;
  }

  return `${quantity}`;
}

export function getProductPrice(
  product: Product,
  quantity?: number
): number {
  if (
    quantity !== undefined &&
    product.quantityPrices &&
    product.quantityPrices[quantity] !== undefined
  ) {
    return product.quantityPrices[quantity];
  }

  return product.price;
}

export function getProductOldPrice(
  product: Product,
  quantity?: number
): number | null {
  if (
    quantity !== undefined &&
    product.quantityOldPrices &&
    product.quantityOldPrices[quantity] !== undefined
  ) {
    return product.quantityOldPrices[quantity];
  }

  return product.oldPrice;
}

export function getProductDiscount(
  product: Product,
  quantity?: number
): number {
  const price = getProductPrice(product, quantity);
  const oldPrice = getProductOldPrice(product, quantity);

  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export const products: Product[] = [
  {
    id: 1,
    name: "Garlic",
    shortText: "Fresh local garlic for everyday cooking.",
    category: "Grocery",
    section: "Cooking Essentials",
    productType: "Garlic",
    brand: "Local",
    image: "/products/garlic.jpg",
    images: ["/products/garlic.jpg"],
    primaryImage: "/products/garlic.jpg",
    price: 180,
    oldPrice: 200,
    unit: "kg",
    step: 100,
    minQuantity: 100,
    defaultQuantity: 100,
    maxQuantity: 10000,
    stock: 100,
    verified: true,
    status: "active",
    description:
      "Fresh local garlic suitable for everyday cooking. Carefully selected for good quality and freshness.",
    keywords: [
      "garlic",
      "rosun",
      "রসুন",
      "fresh garlic",
      "cooking garlic",
    ],
    returnPolicy:
      "Fresh condition e delivery pawar 24 hours er moddhe return kora jabe.",
    monthlyBazar: true,
    discountProduct: true,
    suggestedProduct: true,
    searchTerms: [
      "garlic",
      "rosun",
      "রসুন",
      "fresh garlic",
    ],
  },

  {
    id: 2,
    name: "Teer Advanced Soybean Oil",
    shortText: "Quality soybean oil for everyday cooking.",
    category: "Grocery",
    section: "Cooking Essentials",
    productType: "Oil",
    brand: "Teer",
    image: "/products/teer-oil.jpg",
    images: ["/products/teer-oil.jpg"],
    primaryImage: "/products/teer-oil.jpg",
    price: 890,
    oldPrice: 950,
    unit: "liter",
    step: 1,
    minQuantity: 1,
    defaultQuantity: 1,
    maxQuantity: 10,
    stock: 50,
    verified: true,
    status: "active",
    description:
      "Teer Advanced Soybean Oil is suitable for regular household cooking and everyday food preparation.",
    keywords: [
      "teer oil",
      "soybean oil",
      "soyabean oil",
      "তীর তেল",
      "সয়াবিন তেল",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: true,
    suggestedProduct: true,
    searchTerms: [
      "teer oil",
      "soybean oil",
      "soyabean oil",
      "তীর তেল",
      "সয়াবিন তেল",
    ],
  },

  {
    id: 3,
    name: "Potato",
    shortText: "Fresh potatoes for daily meals.",
    category: "Grocery",
    section: "Monthly Bazar",
    productType: "Potato",
    brand: "Local",
    image: "/products/potato.jpg",
    images: ["/products/potato.jpg"],
    primaryImage: "/products/potato.jpg",
    price: 30,
    oldPrice: null,
    unit: "kg",
    step: 100,
    minQuantity: 100,
    defaultQuantity: 100,
    maxQuantity: 10000,
    stock: 150,
    verified: true,
    status: "active",
    description:
      "Fresh local potatoes suitable for regular household cooking.",
    keywords: [
      "potato",
      "alu",
      "আলু",
      "fresh potato",
    ],
    returnPolicy:
      "Fresh condition e delivery pawar 24 hours er moddhe return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "potato",
      "alu",
      "আলু",
      "fresh potato",
    ],
  },

  {
    id: 4,
    name: "Onion",
    shortText: "Fresh local onion for everyday cooking.",
    category: "Grocery",
    section: "Monthly Bazar",
    productType: "Onion",
    brand: "Local",
    image: "/products/onion.jpg",
    images: ["/products/onion.jpg"],
    primaryImage: "/products/onion.jpg",
    price: 60,
    oldPrice: null,
    unit: "kg",
    step: 100,
    minQuantity: 100,
    defaultQuantity: 100,
    maxQuantity: 10000,
    stock: 150,
    verified: true,
    status: "active",
    description:
      "Fresh local onions selected for everyday household cooking.",
    keywords: [
      "onion",
      "peyaj",
      "পেঁয়াজ",
      "fresh onion",
    ],
    returnPolicy:
      "Fresh condition e delivery pawar 24 hours er moddhe return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "onion",
      "peyaj",
      "পেঁয়াজ",
      "fresh onion",
    ],
  },

  {
    id: 5,
    name: "Teer Maida",
    shortText: "Fine quality maida for baking and cooking.",
    category: "Grocery",
    section: "Cooking Essentials",
    productType: "Maida",
    brand: "Teer",
    image: "/products/teer-maida.jpg",
    images: ["/products/teer-maida.jpg"],
    primaryImage: "/products/teer-maida.jpg",
    price: 75,
    oldPrice: null,
    unit: "packet",
    step: 1,
    minQuantity: 1,
    defaultQuantity: 1,
    maxQuantity: 20,
    stock: 60,
    verified: true,
    status: "active",
    description:
      "Teer Maida is suitable for baking, snacks and everyday cooking needs.",
    keywords: [
      "teer maida",
      "maida",
      "ময়দা",
      "flour",
      "teer flour",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "teer maida",
      "maida",
      "ময়দা",
      "flour",
      "teer flour",
    ],
  },

  {
    id: 6,
    name: "Teer Atta",
    shortText: "Quality atta for healthy everyday meals.",
    category: "Grocery",
    section: "Cooking Essentials",
    productType: "Atta",
    brand: "Teer",
    image: "/products/teer-atta.jpg",
    images: ["/products/teer-atta.jpg"],
    primaryImage: "/products/teer-atta.jpg",
    price: 65,
    oldPrice: null,
    unit: "packet",
    step: 1,
    minQuantity: 1,
    defaultQuantity: 1,
    maxQuantity: 20,
    stock: 60,
    verified: true,
    status: "active",
    description:
      "Teer Atta is suitable for roti, paratha and regular household cooking.",
    keywords: [
      "teer atta",
      "atta",
      "আটা",
      "wheat flour",
      "teer wheat flour",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "teer atta",
      "atta",
      "আটা",
      "wheat flour",
      "teer wheat flour",
    ],
  },

  {
    id: 7,
    name: "Sugar",
    shortText: "Everyday refined sugar for household use.",
    category: "Grocery",
    section: "Monthly Bazar",
    productType: "Sugar",
    brand: "Local",
    image: "/products/sugar.jpg",
    images: ["/products/sugar.jpg"],
    primaryImage: "/products/sugar.jpg",
    price: 135,
    oldPrice: null,
    unit: "kg",
    step: 100,
    minQuantity: 100,
    defaultQuantity: 100,
    maxQuantity: 10000,
    stock: 100,
    verified: true,
    status: "active",
    description:
      "Quality sugar suitable for tea, desserts and everyday household use.",
    keywords: [
      "sugar",
      "chini",
      "চিনি",
      "refined sugar",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "sugar",
      "chini",
      "চিনি",
      "refined sugar",
    ],
  },

  {
    id: 8,
    name: "ACI Salt",
    shortText: "Quality salt for everyday cooking.",
    category: "Grocery",
    section: "Cooking Essentials",
    productType: "Salt",
    brand: "ACI",
    image: "/products/aci-salt.jpg",
    images: ["/products/aci-salt.jpg"],
    primaryImage: "/products/aci-salt.jpg",
    price: 42,
    oldPrice: null,
    unit: "packet",
    step: 1,
    minQuantity: 1,
    defaultQuantity: 1,
    maxQuantity: 20,
    stock: 80,
    verified: true,
    status: "active",
    description:
      "ACI Salt is suitable for everyday household cooking and food preparation.",
    keywords: [
      "aci salt",
      "salt",
      "লবণ",
      "aci",
      "table salt",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "aci salt",
      "salt",
      "লবণ",
      "aci",
      "table salt",
    ],
  },

  {
    id: 9,
    name: "Marks Milk Powder",
    shortText: "Milk powder available in multiple pack sizes.",
    category: "Dairy & Bakery",
    section: "Breakfast Essentials",
    productType: "Milk Powder",
    brand: "Marks",
    image: "/products/marks-milk-powder.jpg",
    images: ["/products/marks-milk-powder.jpg"],
    primaryImage: "/products/marks-milk-powder.jpg",
    price: 455,
    oldPrice: null,
    unit: "gram",
    step: 10,
    minQuantity: 10,
    defaultQuantity: 500,
    maxQuantity: 1000,
    quantityOptions: [10, 75, 100, 250, 500, 1000],
    quantityPrices: {
      10: 10,
      75: 70,
      100: 100,
      250: 235,
      500: 455,
      1000: 910,
    },
    quantityOldPrices: {},
    stock: 50,
    verified: true,
    status: "active",
    description:
      "Marks Milk Powder is available in different pack sizes to suit different household needs.",
    keywords: [
      "marks milk powder",
      "milk powder",
      "milk",
      "দুধের গুঁড়া",
      "marks",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: false,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "marks milk powder",
      "milk powder",
      "milk",
      "দুধের গুঁড়া",
      "marks",
    ],
  },

  {
    id: 10,
    name: "Seylon Tea",
    shortText: "Tea available in convenient pack sizes.",
    category: "Grocery",
    section: "Breakfast Essentials",
    productType: "Tea",
    brand: "Seylon",
    image: "/products/seylon-tea.jpg",
    images: ["/products/seylon-tea.jpg"],
    primaryImage: "/products/seylon-tea.jpg",
    price: 230,
    oldPrice: null,
    unit: "gram",
    step: 100,
    minQuantity: 100,
    defaultQuantity: 500,
    maxQuantity: 500,
    quantityOptions: [100, 250, 500],
    quantityPrices: {
      100: 60,
      250: 120,
      500: 230,
    },
    quantityOldPrices: {},
    stock: 50,
    verified: true,
    status: "active",
    description:
      "Seylon Tea is available in convenient sizes for everyday tea preparation.",
    keywords: [
      "seylon tea",
      "tea",
      "চা",
      "black tea",
      "seylon",
    ],
    returnPolicy:
      "Sealed condition e product receive korar por return kora jabe.",
    monthlyBazar: true,
    discountProduct: false,
    suggestedProduct: true,
    searchTerms: [
      "seylon tea",
      "tea",
      "চা",
      "black tea",
      "seylon",
    ],
  },
];