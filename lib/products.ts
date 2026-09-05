export type ProductUnit =
  | "kg"
  | "gram"
  | "liter"
  | "piece"
  | "packet"
  | "box"
  | "bottle";

export type Product = {
  id: number;
  name: string;
  category: string;

  /*
   * Default / starting price.
   * For fixed-pack products this represents
   * the default available quantity.
   */
  price: number;

  oldPrice: number | null;

  image: string;
  images?: string[];

  discount: string;

  unit: ProductUnit;

  step: number;
  minQuantity: number;
  maxQuantity: number;

  /*
   * Used for fixed-pack products.
   *
   * Example:
   * Milk Powder:
   * 10g, 75g, 100g, 250g, 500g, 1kg
   *
   * Tea:
   * 100g, 250g, 500g
   */
  quantityOptions?: number[];

  /*
   * Price for each fixed quantity.
   *
   * Example:
   * {
   *   100: 55,
   *   250: 140,
   *   500: 282
   * }
   */
  quantityPrices?: Record<number, number>;

  /*
   * Optional old price for individual quantities.
   */
  quantityOldPrices?: Record<number, number>;

  searchTerms: string[];

  description: string;

  brand?: string;
  quality?: string;
  color?: string;

  returnable?: boolean;
  returnNote?: string;
};


/* =========================================================
   PRODUCTS
========================================================= */

export const products: Product[] = [

  /* =======================================================
     PRODUCT 1 — GARLIC
  ======================================================= */

  {
    id: 1,

    name: "তাজা রসুন",

    category: "Grocery",

    price: 180,
    oldPrice: 200,

    image: "/garlic.jpg",

    images: [
      "/garlic.jpg",
    ],

    discount: "10% OFF",

    unit: "kg",

    step: 1000,

    minQuantity: 1000,

    maxQuantity: 10000,

    searchTerms: [
      "garlic",
      "fresh garlic",
      "রসুন",
      "roshun",
    ],

    description:
      "দৈনন্দিন রান্নার জন্য তাজা ও ভালো মানের রসুন। রান্না, মসলা এবং বিভিন্ন খাবার তৈরিতে ব্যবহার করা যায়।",

    brand: "Local Product",

    quality: "Fresh",

    color: "প্রাকৃতিক সাদা",

    returnable: true,

    returnNote:
      "পণ্যটি ব্যবহার না করা অবস্থায় এবং নির্দিষ্ট শর্ত পূরণ হলে ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 2 — TEER ADVANCED SOYABEAN OIL
  ======================================================= */

  {
    id: 2,

    name: "Teer Advanced Soybean Oil",

    category: "Grocery",

    price: 890,
    oldPrice: 950,

    image: "/oil-5-liter.jpg",

    images: [
      "/oil-5-liter.jpg",
    ],

    discount: "6% OFF",

    unit: "liter",

    step: 1,

    minQuantity: 1,

    maxQuantity: 10,

    searchTerms: [
      "oil",
      "soybean oil",
      "soyabean oil",
      "teer oil",
      "teer advanced soybean oil",
      "তেল",
      "সয়াবিন তেল",
      "সয়াবিন তেল",
      "তীর তেল",
    ],

    description:
      "Teer Advanced Soybean Oil দৈনন্দিন রান্নার জন্য ব্যবহৃত মানসম্মত সয়াবিন তেল।",

    brand: "Teer",

    quality: "Standard",

    color: "হালকা হলুদ",

    returnable: true,

    returnNote:
      "পণ্যটি ব্যবহার না করা অবস্থায় এবং নির্দিষ্ট শর্ত পূরণ হলে ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 3 — POTATO
  ======================================================= */

  {
    id: 3,

    name: "আলু",

    category: "Grocery",

    price: 30,

    oldPrice: null,

    image: "/potato.jpg",

    images: [
      "/potato.jpg",
    ],

    discount: "",

    unit: "kg",

    step: 1000,

    minQuantity: 1000,

    maxQuantity: 10000,

    searchTerms: [
      "potato",
      "potatoes",
      "আলু",
      "alu",
      "aloo",
    ],

    description:
      "দৈনন্দিন রান্নার জন্য বাছাই করা তাজা আলু। পরিষ্কার ও ভালো মানের আলু স্থানীয়ভাবে সংগ্রহ করে সরবরাহ করা হয়।",

    brand: "Local Product",

    quality: "Standard",

    color: "প্রাকৃতিক বাদামি",

    returnable: true,

    returnNote:
      "পণ্যটি ব্যবহার না করা অবস্থায় এবং নির্দিষ্ট শর্ত পূরণ হলে ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 4 — ONION
  ======================================================= */

  {
    id: 4,

    name: "পেঁয়াজ",

    category: "Grocery",

    /*
     * Current Bangladesh market reference:
     * approximately ৳60–64/kg.
     *
     * Website price: ৳60/kg
     */
    price: 60,

    oldPrice: null,

    image: "/onion.jpg",

    images: [
      "/onion.jpg",
    ],

    discount: "",

    unit: "kg",

    step: 1000,

    minQuantity: 1000,

    maxQuantity: 10000,

    searchTerms: [
      "onion",
      "onions",
      "পেঁয়াজ",
      "পিয়াজ",
      "peyaj",
      "piaz",
    ],

    description:
      "দৈনন্দিন রান্নার জন্য প্রয়োজনীয় তাজা পেঁয়াজ। ভালো মানের পেঁয়াজ বাছাই করে স্থানীয়ভাবে সরবরাহ করা হয়।",

    brand: "Local Product",

    quality: "Standard",

    color: "প্রাকৃতিক লালচে",

    returnable: true,

    returnNote:
      "পণ্যটি ব্যবহার না করা অবস্থায় এবং নির্দিষ্ট শর্ত পূরণ হলে ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 5 — TEER MAIDA
  ======================================================= */

  {
    id: 5,

    name: "ময়দা",

    category: "Grocery",

    /*
     * Current Bangladesh retail references:
     * around ৳70–80 for 1kg.
     *
     * Website price: ৳75 / 1kg packet
     */
    price: 75,

    oldPrice: null,

    image: "/moyda.jpg",

    images: [
      "/moyda.jpg",
      "/moyda-2.jpg",
    ],

    discount: "",

    unit: "packet",

    step: 1,

    minQuantity: 1,

    maxQuantity: 10,

    searchTerms: [
      "flour",
      "maida",
      "teer maida",
      "ময়দা",
      "ময়দা",
      "moida",
      "moyda",
    ],

    description:
      "Teer ময়দা সূক্ষ্মভাবে প্রক্রিয়াজাত গম থেকে তৈরি। পরোটা, পুরি, পিঠা, কেক ও বিভিন্ন বেকারি খাবার তৈরির জন্য উপযোগী।",

    brand: "Teer",

    quality: "Standard",

    color: "সাদা",

    returnable: true,

    returnNote:
      "প্যাকেট অক্ষত ও unopened অবস্থায় থাকলে নির্দিষ্ট শর্ত অনুযায়ী ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 6 — TEER ATTA
  ======================================================= */

  {
    id: 6,

    name: "আটা",

    category: "Grocery",

    /*
     * Current Bangladesh retail reference:
     * around ৳65–70 for 1kg.
     *
     * Website price: ৳65 / 1kg packet
     */
    price: 65,

    oldPrice: null,

    image: "/atta.jpg",

    images: [
      "/atta.jpg",
      "/atta-2.jpg",
    ],

    discount: "",

    unit: "packet",

    step: 1,

    minQuantity: 1,

    maxQuantity: 10,

    searchTerms: [
      "atta",
      "teer atta",
      "flour",
      "আটা",
      "ata",
      "aata",
    ],

    description:
      "Teer আটা নির্বাচিত গম থেকে তৈরি মানসম্মত whole wheat flour। রুটি, পরোটা ও দৈনন্দিন খাবার তৈরির জন্য উপযোগী।",

    brand: "Teer",

    quality: "Standard",

    color: "প্রাকৃতিক গমের রং",

    returnable: true,

    returnNote:
      "প্যাকেট অক্ষত ও unopened অবস্থায় থাকলে নির্দিষ্ট শর্ত অনুযায়ী ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 7 — SUGAR
  ======================================================= */

  {
    id: 7,

    name: "চিনি",

    category: "Grocery",

    /*
     * Current Bangladesh Department of Agricultural Marketing
     * retail reference: approximately ৳132–135/kg.
     *
     * Website price: ৳135/kg
     */
    price: 135,

    oldPrice: null,

    image: "/sugar.jpg",

    images: [
      "/sugar.jpg",
    ],

    discount: "",

    unit: "kg",

    step: 1000,

    minQuantity: 1000,

    maxQuantity: 10000,

    searchTerms: [
      "sugar",
      "চিনি",
      "chini",
      "chini sugar",
    ],

    description:
      "চা, মিষ্টি ও দৈনন্দিন রান্নার জন্য ব্যবহারযোগ্য দানাদার চিনি।",

    brand: "Local Product",

    quality: "Standard",

    color: "সাদা",

    returnable: true,

    returnNote:
      "পণ্যটি ব্যবহার না করা অবস্থায় এবং নির্দিষ্ট শর্ত পূরণ হলে ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 8 — ACI PURE SALT
  ======================================================= */

  {
    id: 8,

    name: "ACI লবণ",

    category: "Grocery",

    /*
     * Current Bangladesh retail references:
     * ACI Pure Salt 1kg ≈ ৳42.
     *
     * Website price: ৳42 / 1kg packet
     */
    price: 42,

    oldPrice: null,

    image: "/salt.jpg",

    images: [
      "/salt.jpg",
    ],

    discount: "",

    unit: "packet",

    step: 1,

    minQuantity: 1,

    maxQuantity: 10,

    searchTerms: [
      "salt",
      "aci salt",
      "aci pure salt",
      "লবণ",
      "এসি আই লবণ",
      "lobon",
      "laban",
    ],

    description:
      "ACI লবণ দৈনন্দিন রান্নার জন্য ব্যবহৃত মানসম্মত প্যাকেটজাত লবণ।",

    brand: "ACI",

    quality: "Standard",

    color: "সাদা",

    returnable: true,

    returnNote:
      "প্যাকেট অক্ষত ও unopened অবস্থায় থাকলে নির্দিষ্ট শর্ত অনুযায়ী ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 9 — MARKS FULL CREAM MILK POWDER
  ======================================================= */

  {
    id: 9,

    name: "Marks Milk Powder",

    category: "Dairy & Bakery",

    /*
     * Default selected pack:
     * 500g = ৳455
     *
     * Current retail references also show
     * 1kg around ৳900–910.
     */
    price: 455,

    oldPrice: null,

    image: "/milk-powder.jpg",

    images: [
      "/milk-powder.jpg",
    ],

    discount: "",

    unit: "gram",

    step: 1,

    minQuantity: 10,

    maxQuantity: 1000,

    quantityOptions: [
      10,
      75,
      100,
      250,
      500,
      1000,
    ],

    /*
     * Pack-size prices.
     *
     * 500g and 1kg are based on currently observed
     * Bangladesh retail listings.
     *
     * Smaller pack prices should be treated as
     * provisional until the exact packet MRP is checked.
     */
    quantityPrices: {
      10: 10,
      75: 70,
      100: 100,
      250: 235,
      500: 455,
      1000: 910,
    },

    searchTerms: [
      "milk powder",
      "marks milk powder",
      "marks",
      "marks full cream milk powder",
      "দুধের গুঁড়া",
      "দুধের গুঁড়া",
      "milk",
      "dudh",
    ],

    description:
      "Marks Full Cream Milk Powder-এর বিভিন্ন নির্ধারিত প্যাক সাইজ। দৈনন্দিন ব্যবহারের জন্য সুবিধাজনক বিভিন্ন পরিমাণে পাওয়া যায়।",

    brand: "Marks",

    quality: "Full Cream",

    color: "সাদা",

    returnable: true,

    returnNote:
      "প্যাকেট অক্ষত ও unopened অবস্থায় থাকলে নির্দিষ্ট শর্ত অনুযায়ী ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },


  /* =======================================================
     PRODUCT 10 — SEYLON TEA
  ======================================================= */

  {
    id: 10,

    name: "সিলন চা পাতা",

    category: "Grocery",

    /*
     * Default selected pack:
     * 500g = ৳230
     *
     * Exact price can vary by specific Seylon variant.
     */
    price: 230,

    oldPrice: null,

    image: "/tea.jpg",

    images: [
      "/tea.jpg",
    ],

    discount: "",

    unit: "gram",

    step: 1,

    minQuantity: 100,

    maxQuantity: 500,

    quantityOptions: [
      100,
      250,
      500,
    ],

    /*
     * 500g reference is based on a current
     * Bangladesh retail listing for Sylon Gold Tea.
     *
     * 100g and 250g are provisional website prices
     * until the exact packet MRP is checked.
     */
    quantityPrices: {
      100: 60,
      250: 120,
      500: 230,
    },

    searchTerms: [
      "tea",
      "tea leaves",
      "ceylon tea",
      "seylon tea",
      "sylon tea",
      "সিলন চা",
      "চা পাতা",
      "চা",
      "cha",
      "cha pata",
      "tea pata",
    ],

    description:
      "Seylon চা পাতা প্রতিদিনের চা তৈরির জন্য উপযোগী। ১০০ গ্রাম, ২৫০ গ্রাম ও ৫০০ গ্রামের বিভিন্ন প্যাক সাইজে পাওয়া যায়।",

    brand: "Seylon",

    quality: "Standard",

    color: "গাঢ় বাদামি",

    returnable: true,

    returnNote:
      "প্যাকেট অক্ষত ও unopened অবস্থায় থাকলে নির্দিষ্ট শর্ত অনুযায়ী ৪৮ ঘণ্টার মধ্যে return request করা যাবে।",
  },
];


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

export function getProductById(
  id: number
): Product | undefined {
  return products.find(
    (product) => product.id === id
  );
}


export function searchProducts(
  query: string
): Product[] {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.category,
      product.brand ?? "",
      product.quality ?? "",
      ...product.searchTerms,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      normalizedQuery
    );
  });
}


export function getProductsByCategory(
  category: string
): Product[] {
  return products.filter(
    (product) =>
      product.category.toLowerCase() ===
      category.toLowerCase()
  );
}


/* =========================================================
   PRICE HELPER
========================================================= */

export function getProductPrice(
  product: Product,
  quantity?: number
): number {
  /*
   * Fixed pack-size products:
   *
   * Example:
   * Milk Powder 500g -> ৳455
   * Tea 250g -> ৳120
   */
  if (
    quantity !== undefined &&
    product.quantityPrices &&
    product.quantityPrices[quantity] !== undefined
  ) {
    return product.quantityPrices[quantity];
  }

  /*
   * Normal products:
   * return their default price.
   */
  return product.price;
}


/* =========================================================
   OLD PRICE HELPER
========================================================= */

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


/* =========================================================
   QUANTITY FORMATTER
========================================================= */

export function formatQuantity(
  quantity: number,
  unit: ProductUnit
): string {

  if (unit === "kg") {
    if (quantity >= 1000) {
      const kg = quantity / 1000;

      return `${kg} kg`;
    }

    return `${quantity} g`;
  }


  if (unit === "gram") {
    if (quantity >= 1000) {
      const kg = quantity / 1000;

      return `${kg} kg`;
    }

    return `${quantity} g`;
  }


  if (unit === "liter") {
    return `${quantity} L`;
  }


  if (unit === "piece") {
    return `${quantity} piece`;
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