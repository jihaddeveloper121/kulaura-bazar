"use client";

import {
  Bot,
  MessageCircle,
  Send,
  X,
  Sparkles,
  RotateCcw,
  UserRound,
  Volume2,
  ShoppingBag,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  products,
  formatQuantity,
  getProductPrice,
  type Product,
} from "@/lib/products";

type Position = {
  x: number;
  y: number;
};

type Gender = "male" | "female" | null;

type CustomerProfile = {
  name: string;
  gender: Gender;
};

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

type Intent =
  | "greeting"
  | "general_chat"
  | "thanks"
  | "help"
  | "product_search"
  | "product_price"
  | "product_availability"
  | "product_quantity"
  | "add_to_cart"
  | "delivery"
  | "delivery_charge"
  | "return"
  | "payment"
  | "location"
  | "company"
  | "founder"
  | "complaint"
  | "goodbye"
  | "unknown";

type DetectedProduct = {
  product: Product;
  score: number;
};

type Analysis = {
  intent: Intent;
  confidence: number;
  product: Product | null;
  quantity: number | null;
  unit: string | null;
  number: number | null;
};

const DEFAULT_POSITION: Position = {
  x: 24,
  y: 150,
};

const INITIAL_MESSAGE =
  "আসসালামু আলাইকুম। আমি Jihad, KULAURA BAZAR-এর shopping assistant।\n\nআপনি product, price, quantity, delivery, return policy, payment অথবা সাধারণ কোনো বিষয়ে আমাকে জিজ্ঞেস করতে পারেন।\n\nকথা বলতে চাইলে সেটাও বলতে পারেন।";

const COMMON_SUGGESTIONS = [
  "KULAURA BAZAR কোথায়?",
  "Delivery কতক্ষণে হবে?",
  "Return policy কী?",
  "কী কী products আছে?",
];

const STORAGE_POSITION = "kulaura-ai-position";
const STORAGE_PROFILE = "kulaura-ai-profile";

const STOP_WORDS = [
  "the",
  "a",
  "an",
  "is",
  "are",
  "what",
  "how",
  "much",
  "please",
  "can",
  "you",
  "me",
  "do",
  "does",
  "i",
  "want",
  "need",
  "give",
  "show",
  "price",
  "er",
  "ta",
  "টা",
  "টি",
  "একটা",
  "একটি",
  "আমার",
  "দরকার",
  "চাই",
  "দেন",
  "দাও",
];

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  greeting: [
    "hi",
    "hello",
    "hey",
    "salam",
    "assalamu",
    "আসসালামু",
    "সালাম",
    "হ্যালো",
    "হাই",
  ],

  general_chat: [
    "how are you",
    "how r u",
    "ki obostha",
    "কেমন আছ",
    "কেমন আছেন",
    "কি অবস্থা",
    "কী অবস্থা",
    "mon valo",
    "মন ভালো",
    "bhalo acho",
    "ভালো আছ",
    "nice",
    "ভালো",
    "great",
    "awesome",
    "cool",
    "hmm",
    "হুম",
    "hmmm",
    "আচ্ছা",
    "acha",
    "okay",
    "ok",
    "oh",
    "ohh",
    "umm",
    "hmm",
  ],

  thanks: [
    "thanks",
    "thank you",
    "thank",
    "ধন্যবাদ",
    "অনেক ধন্যবাদ",
    "শুকরিয়া",
    "জাযাকাল্লাহ",
  ],

  help: [
    "help",
    "সাহায্য",
    "কি করতে পারি",
    "what can you do",
    "তুমি কি করতে পার",
    "আপনি কি করতে পারেন",
  ],

  product_search: [
    "product",
    "products",
    "item",
    "items",
    "কি কি আছে",
    "কী কী আছে",
    "কি আছে",
    "কী আছে",
    "দেখাও",
    "show me",
    "list",
    "available",
    "কি পাওয়া যায়",
    "কী পাওয়া যায়",
  ],

  product_price: [
    "price",
    "cost",
    "দাম",
    "মূল্য",
    "কত",
    "কতো",
    "how much",
    "কত টাকা",
    "কয় টাকা",
    "টাকা",
  ],

  product_availability: [
    "available",
    "availability",
    "আছে",
    "আছেএ",
    "মজুদ",
    "stock",
    "স্টক",
    "পাওয়া যাবে",
    "পাওয়া যায়",
    "রয়েছে",
    "আনবেন",
  ],

  product_quantity: [
    "quantity",
    "weight",
    "ওজন",
    "gram",
    "গ্রাম",
    "kg",
    "কেজি",
    "liter",
    "লিটার",
    "packet",
    "প্যাকেট",
    "pack",
    "প্যাক",
    "size",
    "সাইজ",
  ],

  add_to_cart: [
    "cart",
    "add",
    "নাও",
    "নেন",
    "দেন",
    "দাও",
    "কার্ট",
    "যোগ",
    "কিনতে চাই",
    "কিনব",
    "নিতে চাই",
    "লাগবে",
    "দরকার",
  ],

  delivery: [
    "delivery",
    "deliver",
    "ডেলিভারি",
    "পৌঁছ",
    "পৌছ",
    "কখন পাব",
    "কখন আসবে",
    "কতক্ষণ",
    "কত সময়",
    "সময় লাগে",
  ],

  delivery_charge: [
    "delivery charge",
    "delivery fee",
    "delivery cost",
    "ডেলিভারি চার্জ",
    "ডেলিভারি ফি",
    "চার্জ কত",
    "কত চার্জ",
  ],

  return: [
    "return",
    "refund",
    "exchange",
    "ফেরত",
    "রিটার্ন",
    "বদল",
    "পরিবর্তন",
    "refund",
  ],

  payment: [
    "payment",
    "pay",
    "bkash",
    "bikash",
    "cash",
    "cod",
    "qr",
    "পেমেন্ট",
    "বিকাশ",
    "ক্যাশ",
    "টাকা দিব",
    "টাকা দেব",
  ],

  location: [
    "location",
    "address",
    "where",
    "কোথায়",
    "কোথায়",
    "ঠিকানা",
    "লোকেশন",
    "দোকান কোথায়",
    "shop কোথায়",
    "দোকান",
  ],

  company: [
    "company",
    "business",
    "about",
    "কোম্পানি",
    "ব্যবসা",
    "সম্পর্কে",
    "kulaura bazar কি",
    "kulaura bazar কী",
  ],

  founder: [
    "founder",
    "owner",
    "director",
    "managing director",
    "md",
    "প্রতিষ্ঠাতা",
    "মালিক",
    "পরিচালক",
    "জিহাদুর",
    "জিহাদুর রহমান",
  ],

  complaint: [
    "problem",
    "issue",
    "complain",
    "complaint",
    "সমস্যা",
    "অভিযোগ",
    "ভুল",
    "কাজ করছে না",
    "হচ্ছে না",
  ],

  goodbye: [
    "bye",
    "goodbye",
    "বিদায়",
    "আসি",
    "পরে কথা",
    "যাই",
  ],

  unknown: [],
};

const PRODUCT_ALIASES: Record<string, string[]> = {
  "Teer Advanced Soybean Oil": [
    "teer",
    "teer oil",
    "teer tel",
    "teer soyabean",
    "soybean oil",
    "soyabean oil",
    "সয়াবিন তেল",
    "সয়াবিন",
    "তেল",
    "টীর",
    "টিয়ার",
  ],

  Garlic: [
    "garlic",
    "রসুন",
  ],

  Potato: [
    "potato",
    "আলু",
  ],

  Onion: [
    "onion",
    "পেঁয়াজ",
    "পিয়াজ",
  ],

  "Teer Maida": [
    "maida",
    "ময়দা",
    "ময়দা",
  ],

  "Teer Atta": [
    "atta",
    "আটা",
  ],

  Sugar: [
    "sugar",
    "চিনি",
  ],

  "ACI Salt": [
    "salt",
    "লবণ",
    "নুন",
    "aci salt",
  ],

  "Marks Milk Powder": [
    "milk powder",
    "milk",
    "marks milk",
    "marks",
    "দুধের গুঁড়া",
    "দুধের গুড়া",
    "মিল্ক পাউডার",
  ],

  "Seylon Tea": [
    "tea",
    "sey lon",
    "seylon",
    "ceylon",
    "চা",
  ],
};

const RESPONSE_VARIATIONS: Record<
  string,
  string[]
> = {
  greeting: [
    "ওয়ালাইকুম আসসালাম। বলুন, কীভাবে help করতে পারি?",
    "ওয়ালাইকুম আসসালাম। জি, বলুন—আমি শুনছি।",
    "ওয়ালাইকুম আসসালাম। KULAURA BAZAR নিয়ে কী জানতে চান?",
  ],

  thanks: [
    "Welcome। সাহায্য করতে পেরে ভালো লাগছে।",
    "অবশ্যই। যখন দরকার হবে, বলবেন।",
    "No problem। আরও কিছু লাগলে জানাবেন।",
  ],

  help: [
    "অবশ্যই। Product, price, quantity, delivery, payment, return policy—এসব নিয়ে help করতে পারি। চাইলে সাধারণভাবেও কথা বলতে পারেন।",
    "জি। কোনো product খুঁজে দেওয়া, দাম বা availability জানা, delivery ও payment সম্পর্কে তথ্য দেওয়া—এসবেই আমি help করতে পারি।",
  ],

  general_chat: [
    "হুম, বলুন। আমি শুনছি।",
    "জি, বলুন। কী নিয়ে কথা বলতে চান?",
    "আচ্ছা। আমি আছি—বলুন।",
    "হুম, বুঝতে পারছি। বলুন।",
    "ওহ, ঠিক আছে। বলুন, কী হয়েছে?",
  ],

  goodbye: [
    "ঠিক আছে। ভালো থাকবেন। প্রয়োজন হলে আবার আসবেন।",
    "অবশ্যই। পরে আবার কথা হবে।",
    "ঠিক আছে। আপনার দিনটা ভালো কাটুক।",
  ],

  location: [
    "KULAURA BAZAR-এর shopটি Chowdhury Bazar, Kulaura Upazila-এর Azad Complex Building-এর Ground Floor-এ।",
    "আমাদের location: Chowdhury Bazar, Kulaura Upazila, Azad Complex Building, Ground Floor।",
    "জি, KULAURA BAZAR আছে Chowdhury Bazar-এর Azad Complex Building-এর Ground Floor-এ।",
  ],

  founder: [
    "KULAURA BAZAR-এর Founder & Managing Director হলেন Jihadur Rahman।",
    "KULAURA BAZAR পরিচালনা করছেন Founder & Managing Director Jihadur Rahman।",
    "Founder & Managing Director: Jihadur Rahman।",
  ],

  company: [
    "KULAURA BAZAR হলো Kulaura-কেন্দ্রিক online shopping service, যেখানে everyday shopping products সহজে order করার সুবিধা দেওয়া হচ্ছে।",
    "KULAURA BAZAR-এর লক্ষ্য হলো Kulaura এলাকার customers-এর জন্য convenient online shopping experience তৈরি করা।",
    "এটা Kulaura-focused online shopping platform—grocery এবং everyday প্রয়োজনীয় products সহজে order করার জন্য তৈরি।",
  ],

  payment: [
    "Payment-এর জন্য Cash on Delivery, bKash এবং Bangla QR option রাখা হয়েছে।",
    "জি, COD, bKash এবং Bangla QR—এই payment options available।",
    "আপনি Cash on Delivery বা available digital payment options-এর মাধ্যমে payment করতে পারবেন।",
  ],

  return: [
    "Return বা exchange product-এর condition ও situation-এর ওপর নির্ভর করে। Product-এর issue থাকলে order details নিয়ে আমাদের সঙ্গে যোগাযোগ করতে হবে।",
    "Return policy product ও condition অনুযায়ী apply করে। কোনো সমস্যা হলে order informationসহ support-এর সঙ্গে যোগাযোগ করুন।",
    "জি, কিছু ক্ষেত্রে return/exchange করা যায়। তবে product-এর condition ও issue অনুযায়ী eligibility check করতে হবে।",
  ],

  delivery: [
    "Kulaura area-তে Premium delivery সাধারণত প্রায় 30 মিনিটের মধ্যে। Average delivery সাধারণত 8 ঘণ্টার মধ্যে।",
    "Delivery-এর দুইটা option আছে—Premium প্রায় 30 মিনিট, আর Average delivery 8 ঘণ্টার মধ্যে।",
    "জি, Kulaura area-তে Premium delivery দ্রুত পৌঁছানোর জন্য, আর Average delivery সাধারণত 8 ঘণ্টার মধ্যে দেওয়া হয়।",
  ],

  delivery_charge: [
    "Premium delivery সাধারণত ৳30। তবে eligible order হলে Premium delivery free হতে পারে। Average delivery free।",
    "Delivery charge option অনুযায়ী—Premium ৳30, আর Average delivery free। নির্দিষ্ট qualifying order-এ Premium-ও free হতে পারে।",
    "জি, Premium delivery-এর charge ৳30। আর Average delivery-এর জন্য আলাদা charge নেই।",
  ],

  product_search: [
    "অবশ্যই। KULAURA BAZAR-এ grocery, beauty, stationery, dairy & bakery, soft drinks, home essentials, baby careসহ বিভিন্ন category আছে।",
    "জি। Everyday grocery থেকে শুরু করে beauty, stationery, dairy & bakery, home essentials এবং baby care—বিভিন্ন ধরনের products আছে।",
  ],

  complaint: [
    "দুঃখিত, সমস্যাটা ঠিকভাবে বুঝতে চাই। কোন বিষয়টা কাজ করছে না বলবেন?",
    "অবশ্যই দেখছি। সমস্যাটা product, order, payment নাকি delivery নিয়ে?",
    "হুম, ঠিক আছে। একটু details বললে আমি বিষয়টা বুঝে help করার চেষ্টা করছি।",
  ],

  unknown: [
    "হুম, কথাটা পুরোপুরি ধরতে পারিনি। একটু অন্যভাবে বলবেন?",
    "জি, বুঝতে চেষ্টা করছি। Product বা বিষয়টা একটু clear করে বলবেন?",
    "হুম, এই কথাটা একটু unclear হয়েছে। আরেকটু details দিলে ভালোভাবে help করতে পারব।",
  ],
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[!?.,;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ");
}

function removeStopWords(value: string) {
  return value
    .split(" ")
    .filter(
      (word) =>
        word.length > 1 &&
        !STOP_WORDS.includes(word),
    )
    .join(" ");
}

function containsKeyword(
  text: string,
  keyword: string,
) {
  const normalizedKeyword =
    normalizeText(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  return text.includes(normalizedKeyword);
}

function getKeywordScore(
  text: string,
  keywords: string[],
) {
  let score = 0;

  for (const keyword of keywords) {
    if (containsKeyword(text, keyword)) {
      const normalized =
        normalizeText(keyword);

      score += normalized.includes(" ")
        ? 3
        : 1;
    }
  }

  return score;
}

function detectIntent(text: string): {
  intent: Intent;
  confidence: number;
} {
  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      intent: "unknown",
      confidence: 0,
    };
  }

  const scores = (
    Object.keys(
      INTENT_KEYWORDS,
    ) as Intent[]
  ).map((intent) => ({
    intent,
    score: getKeywordScore(
      normalized,
      INTENT_KEYWORDS[intent],
    ),
  }));

  scores.sort(
    (a, b) => b.score - a.score,
  );

  const best = scores[0];

  if (!best || best.score === 0) {
    return {
      intent: "unknown",
      confidence: 0.1,
    };
  }

  const confidence = Math.min(
    0.55 + best.score * 0.12,
    0.97,
  );

  return {
    intent: best.intent,
    confidence,
  };
}

function findProduct(
  text: string,
): DetectedProduct | null {
  const normalized = normalizeText(text);

  let best: DetectedProduct | null = null;

  for (const product of products) {
    const productName =
      normalizeText(product.name);

    let score = 0;

    if (
      normalized.includes(productName)
    ) {
      score += 10;
    }

    const aliases =
      PRODUCT_ALIASES[product.name] ?? [];

    for (const alias of aliases) {
      if (
        normalized.includes(
          normalizeText(alias),
        )
      ) {
        score += alias.includes(" ")
          ? 7
          : 4;
      }
    }

    const searchTerms =
      product.searchTerms ?? [];

    for (const term of searchTerms) {
      if (
        normalized.includes(
          normalizeText(term),
        )
      ) {
        score += 3;
      }
    }

    if (score > 0) {
      if (
        !best ||
        score > best.score
      ) {
        best = {
          product,
          score,
        };
      }
    }
  }

  return best;
}

function extractNumber(
  text: string,
): number | null {
  const match = text.match(
    /\b\d+(?:\.\d+)?\b/,
  );

  if (!match) {
    return null;
  }

  const number = Number(match[0]);

  return Number.isFinite(number)
    ? number
    : null;
}

function detectUnit(text: string) {
  const normalized = normalizeText(text);

  if (
    /\bkg\b/.test(normalized) ||
    normalized.includes("কেজি")
  ) {
    return "kg";
  }

  if (
    /\b(?:g|gram|grams)\b/.test(
      normalized,
    ) ||
    normalized.includes("গ্রাম")
  ) {
    return "gram";
  }

  if (
    /\b(?:l|liter|litre|liters|litres)\b/.test(
      normalized,
    ) ||
    normalized.includes("লিটার")
  ) {
    return "liter";
  }

  if (
    normalized.includes("packet") ||
    normalized.includes("pack") ||
    normalized.includes("প্যাকেট") ||
    normalized.includes("প্যাক")
  ) {
    return "packet";
  }

  if (
    normalized.includes("piece") ||
    normalized.includes("pcs") ||
    normalized.includes("টা") ||
    normalized.includes("টি")
  ) {
    return "piece";
  }

  return null;
}

function convertQuantityToProductUnit(
  number: number | null,
  unit: string | null,
  product: Product | null,
) {
  if (
    number === null ||
    !product
  ) {
    return null;
  }

  if (
    product.unit === "kg" &&
    unit === "gram"
  ) {
    return number;
  }

  if (
    product.unit === "gram" &&
    unit === "kg"
  ) {
    return number * 1000;
  }

  return number;
}

function analyzeMessage(
  message: string,
  previousProduct?: Product | null,
): Analysis {
  const normalized =
    normalizeText(message);

  const detectedIntent =
    detectIntent(normalized);

  const detected =
    findProduct(normalized);

  const product =
    detected?.product ??
    previousProduct ??
    null;

  const number =
    extractNumber(normalized);

  const unit =
    detectUnit(normalized);

  const quantity =
    convertQuantityToProductUnit(
      number,
      unit,
      product,
    );

  let intent =
    detectedIntent.intent;

  /*
   * Product context can refine
   * otherwise ambiguous messages.
   */

  if (
    product &&
    detectedIntent.confidence < 0.5
  ) {
    if (
      normalized.includes("দাম") ||
      normalized.includes("price") ||
      normalized.includes("cost") ||
      normalized.includes("কত")
    ) {
      intent = "product_price";
    } else if (
      normalized.includes("আছে") ||
      normalized.includes("available") ||
      normalized.includes("stock")
    ) {
      intent =
        "product_availability";
    } else if (
      unit ||
      normalized.includes("pack") ||
      normalized.includes("size")
    ) {
      intent =
        "product_quantity";
    }
  }

  /*
   * Very short conversational messages
   * should not accidentally become
   * shopping intents.
   */

  const conversationalOnly =
    [
      "hmm",
      "hmmm",
      "umm",
      "uh",
      "oh",
      "ohh",
      "acha",
      "আচ্ছা",
      "হুম",
      "হুমম",
      "okay",
      "ok",
      "nice",
      "great",
      "cool",
    ].includes(normalized);

  if (conversationalOnly) {
    intent = "general_chat";
  }

  return {
    intent,
    confidence:
      conversationalOnly
        ? 0.95
        : detectedIntent.confidence,
    product,
    quantity,
    unit,
    number,
  };
}

function getRandomItem<T>(
  items: T[],
): T {
  return items[
    Math.floor(
      Math.random() * items.length,
    )
  ];
}

function getCustomerTitle(
  profile: CustomerProfile,
) {
  if (!profile.name) {
    return "";
  }

  if (profile.gender === "male") {
    return `${profile.name} Sir`;
  }

  if (profile.gender === "female") {
    return `${profile.name} Mam`;
  }

  return profile.name;
}

function normalizeName(value: string) {
  let name = value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "");

  name = name.replace(
    /^(my name is|i am|i'm|amar name is|amar name|আমার নাম|নাম)\s+/i,
    "",
  );

  name = name.replace(
    /\s+(sir|mr|mam|ma'am|madam|স্যার|ম্যাম|ম্যাডাম)$/i,
    "",
  );

  return name.trim();
}

function looksLikeQuestion(
  value: string,
) {
  const text =
    normalizeText(value);

  const questionWords = [
    "what",
    "why",
    "how",
    "where",
    "when",
    "which",
    "who",
    "can",
    "do",
    "is",
    "are",
    "price",
    "delivery",
    "return",
    "কি",
    "কী",
    "কেন",
    "কিভাবে",
    "কীভাবে",
    "কোথায়",
    "কোথায়",
    "কত",
    "আছে",
    "হবে",
    "দাম",
  ];

  return (
    value.includes("?") ||
    questionWords.some((word) =>
      text.includes(word),
    )
  );
}

function getSuggestions(
  input: string,
) {
  const value =
    normalizeText(input);

  if (!value) {
    return COMMON_SUGGESTIONS;
  }

  const matched: string[] = [];

  const product =
    findProduct(value);

  if (product) {
    matched.push(
      `${product.product.name}-এর দাম কত?`,
      `${product.product.name} available আছে?`,
      `${product.product.name}-এর pack size কী?`,
    );
  }

  const intent =
    detectIntent(value).intent;

  if (
    intent === "delivery" ||
    value.includes("delivery") ||
    value.includes("ডেলিভারি")
  ) {
    matched.push(
      "Delivery কতক্ষণে হবে?",
      "Delivery charge কত?",
      "Kulaura-র বাইরে delivery হয়?",
    );
  }

  if (
    intent === "return" ||
    value.includes("return") ||
    value.includes("ফেরত")
  ) {
    matched.push(
      "Return policy কী?",
      "কোন products return করা যায়?",
      "Product ফেরত দিতে কী করতে হবে?",
    );
  }

  if (
    intent === "payment" ||
    value.includes("payment") ||
    value.includes("বিকাশ")
  ) {
    matched.push(
      "Payment কীভাবে করব?",
      "bKash দিয়ে payment করা যাবে?",
      "Cash on Delivery আছে?",
    );
  }

  if (matched.length > 0) {
    return [
      ...new Set(matched),
    ].slice(0, 5);
  }

  return [
    "এই product-এর দাম কত?",
    "এটা available আছে?",
    "আরও details বলো",
    "Delivery সম্পর্কে জানতে চাই",
  ];
}

function formatProductPrice(
  product: Product,
  quantity?: number | null,
) {
  const price =
    getProductPrice(
      product,
      quantity ?? undefined,
    );

  return `৳${price}`;
}

function buildProductResponse(
  analysis: Analysis,
) {
  const product =
    analysis.product;

  if (!product) {
    return "কোন productটার কথা বলছেন? নামটা বললে আমি price বা availability check করে বলতে পারব।";
  }

  const quantity =
    analysis.quantity;

  if (
    analysis.intent ===
    "product_price"
  ) {
    if (
      quantity !== null &&
      product.quantityOptions?.includes(
        quantity,
      )
    ) {
      return `${formatQuantity(
        quantity,
        product.unit,
      )} ${product.name}-এর price ${formatProductPrice(
        product,
        quantity,
      )}।`;
    }

    return `${product.name}-এর current price ${formatProductPrice(
      product,
    )} ${
      product.unit === "kg"
        ? "প্রতি kg"
        : product.unit === "liter"
          ? "প্রতি liter"
          : ""
    }।`;
  }

  if (
    analysis.intent ===
    "product_availability"
  ) {
    return `জি, ${product.name} available আছে। চাইলে এর price, pack size বা quantity সম্পর্কেও বলতে পারি।`;
  }

  if (
    analysis.intent ===
    "product_quantity"
  ) {
    if (
      product.quantityOptions &&
      product.quantityOptions.length > 0
    ) {
      const options =
        product.quantityOptions
          .map((item) =>
            formatQuantity(
              item,
              product.unit,
            ),
          )
          .join(", ");

      return `${product.name}-এর available pack/quantity: ${options}।`;
    }

    return `${product.name} সাধারণত ${formatQuantity(
      product.minQuantity,
      product.unit,
    )} থেকে ${
      product.maxQuantity
        ? formatQuantity(
            product.maxQuantity,
            product.unit,
          )
        : ""
    } পর্যন্ত নেওয়া যায়।`;
  }

  if (
    analysis.intent ===
      "add_to_cart" ||
    analysis.intent ===
      "product_search"
  ) {
    if (
      quantity !== null
    ) {
      return `জি, ${formatQuantity(
        quantity,
        product.unit,
      )} ${product.name} নিতে চাইছেন। এর price ${formatProductPrice(
        product,
        quantity,
      )}।`;
    }

    return `জি, ${product.name} available আছে। Price ${formatProductPrice(
      product,
    )}।`;
  }

  return `${product.name} available আছে। Price ${formatProductPrice(
    product,
  )}। চাইলে quantity বা pack size নিয়েও বলতে পারি।`;
}

function generateReply(
  analysis: Analysis,
  profile: CustomerProfile,
  isFirstQuestion: boolean,
) {
  const customerName =
    getCustomerTitle(profile);

  const prefix =
    customerName &&
    Math.random() > 0.55
      ? `${customerName}, `
      : "";

  if (
    analysis.intent ===
      "product_price" ||
    analysis.intent ===
      "product_availability" ||
    analysis.intent ===
      "product_quantity" ||
    analysis.intent ===
      "product_search" ||
    analysis.intent ===
      "add_to_cart"
  ) {
    return `${prefix}${buildProductResponse(
      analysis,
    )}`;
  }

  if (
    analysis.intent ===
    "greeting"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.greeting,
    );
  }

  if (
    analysis.intent ===
    "thanks"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.thanks,
    );
  }

  if (
    analysis.intent ===
    "help"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.help,
    );
  }

  if (
    analysis.intent ===
    "general_chat"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.general_chat,
    );
  }

  if (
    analysis.intent ===
    "goodbye"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.goodbye,
    );
  }

  if (
    analysis.intent ===
    "location"
  ) {
    return `${prefix}${getRandomItem(
      RESPONSE_VARIATIONS.location,
    )}`;
  }

  if (
    analysis.intent ===
    "founder"
  ) {
    return `${prefix}${getRandomItem(
      RESPONSE_VARIATIONS.founder,
    )}`;
  }

  if (
    analysis.intent ===
    "company"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.company,
    );
  }

  if (
    analysis.intent ===
    "payment"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.payment,
    );
  }

  if (
    analysis.intent ===
    "return"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.return,
    );
  }

  if (
    analysis.intent ===
    "delivery"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.delivery,
    );
  }

  if (
    analysis.intent ===
    "delivery_charge"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.delivery_charge,
    );
  }

  if (
    analysis.intent ===
    "complaint"
  ) {
    return getRandomItem(
      RESPONSE_VARIATIONS.complaint,
    );
  }

  if (
    isFirstQuestion
  ) {
    return `ওয়ালাইকুম আসসালাম। ${getRandomItem(
      RESPONSE_VARIATIONS.unknown,
    )}`;
  }

  return `${prefix}${getRandomItem(
    RESPONSE_VARIATIONS.unknown,
  )}`;
}

export default function AIShoppingAssistant() {
  const [position, setPosition] =
    useState<Position>(
      DEFAULT_POSITION,
    );

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [isTyping, setIsTyping] =
    useState(false);

  const [
    hasAskedFirstQuestion,
    setHasAskedFirstQuestion,
  ] = useState(false);

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 1,
        role: "assistant",
        text: INITIAL_MESSAGE,
      },
    ]);

  const [
    customerProfile,
    setCustomerProfile,
  ] = useState<CustomerProfile>({
    name: "",
    gender: null,
  });

  const [
    showGenderPoll,
    setShowGenderPoll,
  ] = useState(false);

  const [
    waitingForName,
    setWaitingForName,
  ] = useState(true);

  const dragRef =
    useRef<HTMLButtonElement | null>(
      null,
    );

  const chatEndRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const isDragging =
    useRef(false);

  const dragStart =
    useRef({
      pointerX: 0,
      pointerY: 0,
      startX: 0,
      startY: 0,
    });

  const lastProductRef =
    useRef<Product | null>(null);

  /*
   * Load saved position/profile
   */
  useEffect(() => {
    try {
      const savedPosition =
        localStorage.getItem(
          STORAGE_POSITION,
        );

      const savedProfile =
        localStorage.getItem(
          STORAGE_PROFILE,
        );

      if (savedPosition) {
        const parsed =
          JSON.parse(
            savedPosition,
          );

        if (
          typeof parsed.x ===
            "number" &&
          typeof parsed.y ===
            "number"
        ) {
          setPosition(parsed);
        }
      }

      if (savedProfile) {
        const parsed =
          JSON.parse(
            savedProfile,
          );

        if (
          parsed &&
          typeof parsed.name ===
            "string"
        ) {
          setCustomerProfile(
            parsed,
          );

          if (parsed.name) {
            setWaitingForName(false);
          }
        }
      }
    } catch {
      // Ignore invalid saved data.
    }
  }, []);

  /*
   * Save position
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_POSITION,
        JSON.stringify(position),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [position]);

  /*
   * Save profile
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_PROFILE,
        JSON.stringify(
          customerProfile,
        ),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [customerProfile]);

  /*
   * Auto-scroll chat
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    isTyping,
    showGenderPoll,
  ]);

  /*
   * Keep AI button inside viewport
   */
  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => ({
        x: Math.min(
          Math.max(current.x, 12),
          Math.max(
            window.innerWidth - 70,
            12,
          ),
        ),
        y: Math.min(
          Math.max(current.y, 80),
          Math.max(
            window.innerHeight - 150,
            80,
          ),
        ),
      }));
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  const liveSuggestions =
    useMemo(
      () =>
        getSuggestions(message),
      [message],
    );

  /*
   * Dragging
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (isOpen) {
      return;
    }

    isDragging.current = true;

    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: position.x,
      startY: position.y,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !isDragging.current ||
      isOpen
    ) {
      return;
    }

    const deltaX =
      event.clientX -
      dragStart.current.pointerX;

    const deltaY =
      event.clientY -
      dragStart.current.pointerY;

    const nextX = Math.min(
      Math.max(
        dragStart.current.startX +
          deltaX,
        12,
      ),
      window.innerWidth - 70,
    );

    const nextY = Math.min(
      Math.max(
        dragStart.current.startY +
          deltaY,
        80,
      ),
      window.innerHeight - 150,
    );

    setPosition({
      x: nextX,
      y: nextY,
    });
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Ignore.
    }
  };

  const openAssistant = () => {
    if (isDragging.current) {
      return;
    }

    setIsOpen(true);
  };

  /*
   * Reset conversation
   */
  const resetChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: INITIAL_MESSAGE,
      },
    ]);

    setMessage("");
    setIsTyping(false);
    setHasAskedFirstQuestion(false);
    setShowGenderPoll(false);

    lastProductRef.current = null;
  };

  /*
   * Gender selection
   */
  const selectGender = (
    gender: Gender,
  ) => {
    if (gender === null) {
      setShowGenderPoll(false);
      return;
    }

    setCustomerProfile(
      (current) => ({
        ...current,
        gender,
      }),
    );

    setShowGenderPoll(false);

    setMessages(
      (current) => [
        ...current,
        {
          id: Date.now(),
          role: "assistant",
          text:
            gender === "male"
              ? `ঠিক আছে, ${customerProfile.name} Sir।`
              : `ঠিক আছে, ${customerProfile.name} Mam।`,
        },
      ],
    );
  };

  /*
   * Main message handler
   */
  const submitMessage = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    const trimmed =
      message.trim();

    if (!trimmed || isTyping) {
      return;
    }

    const userMessage: ChatMessage =
      {
        id: Date.now(),
        role: "user",
        text: trimmed,
      };

    setMessages(
      (current) => [
        ...current,
        userMessage,
      ],
    );

    setMessage("");

    /*
     * Name detection
     */
    if (
      waitingForName &&
      !customerProfile.name &&
      !looksLikeQuestion(trimmed) &&
      trimmed.length <= 50
    ) {
      const extractedName =
        normalizeName(trimmed);

      if (
        extractedName &&
        extractedName.length >= 2
      ) {
        setCustomerProfile({
          name: extractedName,
          gender: null,
        });

        setWaitingForName(false);

        setIsTyping(true);

        window.setTimeout(() => {
          setIsTyping(false);

          setMessages(
            (current) => [
              ...current,
              {
                id:
                  Date.now() + 1,
                role: "assistant",
                text: `Nice to meet you, ${extractedName}। আপনি চাইলে আমি আপনাকে Sir বা Mam হিসেবেও address করতে পারি।`,
              },
            ],
          );

          setShowGenderPoll(true);
        }, 600);

        return;
      }
    }

    /*
     * Analyze message
     */
    const analysis =
      analyzeMessage(
        trimmed,
        lastProductRef.current,
      );

    if (analysis.product) {
      lastProductRef.current =
        analysis.product;
    }

    const isFirstQuestion =
      !hasAskedFirstQuestion;

    setHasAskedFirstQuestion(true);
    setIsTyping(true);

    /*
     * Human-like typing delay
     */
    const typingDelay =
      Math.min(
        1100,
        Math.max(
          450,
          350 +
            trimmed.length * 12,
        ),
      );

    window.setTimeout(() => {
      const reply =
        generateReply(
          analysis,
          customerProfile,
          isFirstQuestion,
        );

      setMessages(
        (current) => [
          ...current,
          {
            id:
              Date.now() + 1,
            role: "assistant",
            text: reply,
          },
        ],
      );

      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <>
      {/* --------------------------------
          Floating AI button
      -------------------------------- */}
      {!isOpen && (
        <button
          ref={dragRef}
          type="button"
          onClick={openAssistant}
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerUp
          }
          aria-label="Open AI shopping assistant"
          className={[
            "fixed z-[100]",
            "flex h-[58px] w-[58px]",
            "touch-none select-none",
            "items-center justify-center",
            "rounded-full",
            "border border-white/20",
            "bg-[#356a47]",
            "text-white",
            "shadow-[0_10px_35px_rgba(0,0,0,0.22)]",
            "transition-transform duration-200",
            "hover:scale-105",
            "active:scale-95",
          ].join(" ")}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <Bot
            size={28}
            strokeWidth={1.8}
          />
        </button>
      )}

      {/* --------------------------------
          Chat window
      -------------------------------- */}
      {isOpen && (
        <div
          className={[
            "fixed inset-x-3 bottom-3 z-[110]",
            "mx-auto",
            "w-auto max-w-[460px]",
            "overflow-hidden",
            "rounded-[24px]",
            "border border-black/10",
            "bg-white",
            "shadow-[0_25px_80px_rgba(0,0,0,0.25)]",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-[#356a47] px-4 py-3.5 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Bot
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold">
                    Jihad
                  </p>

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </div>

                <p className="truncate text-[11px] text-white/75">
                  KULAURA BAZAR AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Reset conversation"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw
                  size={17}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                aria-label="Close assistant"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="max-h-[54vh] min-h-[280px] space-y-3 overflow-y-auto bg-[#f8faf8] px-3 py-4">
            {messages.map(
              (item) => (
                <div
                  key={item.id}
                  className={[
                    "flex",
                    item.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "max-w-[82%]",
                      "rounded-2xl",
                      "px-3.5 py-2.5",
                      "text-[13px]",
                      "leading-relaxed",
                      "whitespace-pre-line",
                      item.role ===
                      "user"
                        ? "rounded-br-md bg-[#356a47] text-white"
                        : "rounded-bl-md border border-black/5 bg-white text-[#17211b] shadow-sm",
                    ].join(" ")}
                  >
                    {item.text}
                  </div>
                </div>
              ),
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#356a47]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#356a47] [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#356a47] [animation-delay:240ms]" />
                </div>
              </div>
            )}

            {showGenderPoll && (
              <div className="rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="text-[#356a47]"
                  />

                  <p className="text-xs font-medium text-[#17211b]">
                    আপনি কীভাবে address করতে চান?
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      selectGender(
                        "male",
                      )
                    }
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs text-[#17211b] transition hover:border-[#356a47] hover:text-[#356a47]"
                  >
                    Sir
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      selectGender(
                        "female",
                      )
                    }
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs text-[#17211b] transition hover:border-[#356a47] hover:text-[#356a47]"
                  >
                    Mam
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      selectGender(
                        null,
                      )
                    }
                    className="rounded-xl border border-black/10 px-3 py-2 text-xs text-[#17211b] transition hover:border-[#356a47] hover:text-[#356a47]"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          <div className="border-t border-black/5 bg-white px-3 pt-2.5">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {liveSuggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      setMessage(
                        suggestion,
                      )
                    }
                    className="shrink-0 rounded-full border border-[#356a47]/15 bg-[#356a47]/5 px-3 py-1.5 text-[11px] text-[#356a47] transition hover:bg-[#356a47]/10"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={submitMessage}
            className="flex items-center gap-2 bg-white px-3 pb-3 pt-1"
          >
            <div className="relative flex-1">
              <MessageCircle
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                placeholder="Ask anything..."
                className={[
                  "h-11 w-full",
                  "rounded-xl",
                  "border border-black/10",
                  "bg-[#f8faf8]",
                  "pl-9 pr-3",
                  "text-sm text-[#17211b]",
                  "outline-none",
                  "transition",
                  "focus:border-[#356a47]/40",
                  "focus:bg-white",
                ].join(" ")}
              />
            </div>

            <button
              type="submit"
              disabled={
                !message.trim() ||
                isTyping
              }
              aria-label="Send message"
              className={[
                "flex h-11 w-11 shrink-0",
                "items-center justify-center",
                "rounded-xl",
                "bg-[#356a47]",
                "text-white",
                "transition-all",
                "hover:bg-[#2d5c3d]",
                "active:scale-95",
                "disabled:cursor-not-allowed",
                "disabled:opacity-40",
              ].join(" ")}
            >
              <Send
                size={18}
                strokeWidth={2}
              />
            </button>
          </form>
        </div>
      )}
    </>
  );
}