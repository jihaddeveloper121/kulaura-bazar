"use client";

import {
  Bot,
  MessageCircle,
  Send,
  X,
  Sparkles,
  RotateCcw,
  UserRound,
  MapPin,
  Truck,
  ShoppingBag,
  RotateCcw as ReturnIcon,
  CreditCard,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

const DEFAULT_POSITION: Position = {
  x: 24,
  y: 150,
};

const INITIAL_MESSAGE =
  "আসসালামু আলাইকুম। আমি Jihad, KULAURA BAZAR-এর shopping assistant।\n\nআপনি product, price, quantity, delivery, return policy, location অথবা shopping suggestion—যেকোনো বিষয়ে আমাকে জিজ্ঞেস করতে পারেন।\n\nআপনি চাইলে আপনার নামও বলতে পারেন।";

const COMMON_SUGGESTIONS = [
  "KULAURA BAZAR কোথায়?",
  "Delivery কতক্ষণে হবে?",
  "Return policy কী?",
  "কোন product আছে?",
];

const SUGGESTION_GROUPS = [
  {
    keywords: [
      "ret",
      "return",
      "রিটার্ন",
      "ফেরত",
      "change",
      "exchange",
    ],
    suggestions: [
      "Return policy কী?",
      "কোন products return করা যায়?",
      "Product ফেরত দিতে কী করতে হবে?",
      "Return করার নিয়ম কী?",
    ],
  },

  {
    keywords: [
      "del",
      "delivery",
      "deliver",
      "ডেলিভারি",
      "পৌঁছ",
      "কতক্ষণ",
      "সময়",
    ],
    suggestions: [
      "Delivery কতক্ষণে হবে?",
      "Delivery charge কত?",
      "Kulaura-র বাইরে delivery হয়?",
      "Premium delivery কী?",
    ],
  },

  {
    keywords: [
      "loc",
      "location",
      "address",
      "shop",
      "দোকান",
      "ঠিকানা",
      "কোথায়",
    ],
    suggestions: [
      "KULAURA BAZAR কোথায়?",
      "Shop-এর address কী?",
      "Kulaura-র কোন জায়গায় দোকান?",
      "Shop location দেখাও",
    ],
  },

  {
    keywords: [
      "founder",
      "owner",
      "md",
      "managing",
      "জিহাদুর",
      "জিহাদ",
      "মালিক",
      "প্রতিষ্ঠাতা",
    ],
    suggestions: [
      "KULAURA BAZAR-এর founder কে?",
      "Managing Director কে?",
      "Jihadur Rahman সম্পর্কে বলো",
      "KULAURA BAZAR কে পরিচালনা করেন?",
    ],
  },

  {
    keywords: [
      "oil",
      "teer",
      "তেল",
      "soybean",
      "সয়াবিন",
      "cooking",
    ],
    suggestions: [
      "Teer Soybean Oil-এর দাম কত?",
      "১ লিটার Teer Oil কত?",
      "Teer Oil কত লিটার আছে?",
      "আর কোন cooking oil আছে?",
    ],
  },

  {
    keywords: [
      "garlic",
      "রসুন",
      "potato",
      "আলু",
      "onion",
      "পেঁয়াজ",
      "grocery",
      "মুদি",
    ],
    suggestions: [
      "Garlic-এর দাম কত?",
      "Potato-এর দাম কত?",
      "Onion-এর দাম কত?",
      "Grocery products দেখাও",
    ],
  },

  {
    keywords: [
      "milk",
      "দুধ",
      "marks",
      "milk powder",
      "powder",
    ],
    suggestions: [
      "Marks Milk Powder-এর pack size কী?",
      "Milk Powder-এর দাম কত?",
      "100g Milk Powder কত?",
      "500g Milk Powder কত?",
    ],
  },

  {
    keywords: [
      "tea",
      "চা",
      "seylon",
      "ceylon",
    ],
    suggestions: [
      "Seylon Tea-এর দাম কত?",
      "100g Tea কত?",
      "250g Tea কত?",
      "500g Tea কত?",
    ],
  },

  {
    keywords: [
      "pay",
      "payment",
      "bkash",
      "cash",
      "qr",
      "পেমেন্ট",
      "বিকাশ",
      "ক্যাশ",
    ],
    suggestions: [
      "Payment কীভাবে করব?",
      "bKash দিয়ে payment করা যাবে?",
      "Cash on Delivery আছে?",
      "Bangla QR আছে?",
    ],
  },

  {
    keywords: [
      "price",
      "দাম",
      "cost",
      "কত",
      "মূল্য",
    ],
    suggestions: [
      "একটা product-এর price কীভাবে দেখব?",
      "Garlic-এর দাম কত?",
      "Teer Oil-এর দাম কত?",
      "Milk Powder-এর দাম কত?",
    ],
  },

  {
    keywords: [
      "about",
      "company",
      "business",
      "কোম্পানি",
      "সম্পর্কে",
    ],
    suggestions: [
      "KULAURA BAZAR সম্পর্কে বলো",
      "KULAURA BAZAR কী?",
      "Company সম্পর্কে জানতে চাই",
      "Founder কে?",
    ],
  },

  {
    keywords: [
      "cart",
      "কার্ট",
      "order",
      "অর্ডার",
      "কেনাকাটা",
      "shopping",
    ],
    suggestions: [
      "কীভাবে order করব?",
      "Cart-এ product কীভাবে যোগ করব?",
      "Order করার নিয়ম কী?",
      "Shopping শুরু করতে চাই",
    ],
  },
];

function getSuggestions(input: string) {
  const value = input.trim().toLowerCase();

  if (!value) {
    return COMMON_SUGGESTIONS;
  }

  const matched: string[] = [];

  for (const group of SUGGESTION_GROUPS) {
    const isMatch = group.keywords.some((keyword) =>
      value.includes(keyword.toLowerCase()),
    );

    if (isMatch) {
      matched.push(...group.suggestions);
    }
  }

  if (matched.length > 0) {
    return [...new Set(matched)].slice(0, 5);
  }

  return [
    "এই product সম্পর্কে জানতে চাই",
    "এই product-এর দাম কত?",
    "Delivery সম্পর্কে জানতে চাই",
    "আরও details বলো",
  ];
}

function getCustomerTitle(profile: CustomerProfile) {
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
    /^(my name is|my name's|i am|i'm|amar name|amr name|amar nam|amr nam|আমার নাম|নাম)\s+/i,
    "",
  );

  name = name.replace(
    /\s+(sir|mr|mam|ma'am|madam|স্যার|ম্যাম|ম্যাডাম)$/i,
    "",
  );

  return name.trim();
}

function looksLikeQuestion(value: string) {
  const text = value.toLowerCase();

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
    "does",
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
    "কত",
    "আছে",
    "হবে",
    "দাম",
    "কোথায়",
  ];

  return (
    value.includes("?") ||
    questionWords.some((word) => text.includes(word))
  );
}

function getDemoReply(
  message: string,
  profile: CustomerProfile,
  isFirstQuestion: boolean,
) {
  const text = message.toLowerCase().trim();

  const customerName = getCustomerTitle(profile);

  const prefix = customerName
    ? `${customerName}, `
    : "";

  const firstQuestionGreeting = isFirstQuestion
    ? "ওয়ালাইকুম আসসালাম। "
    : "";

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("হাই") ||
    text.includes("হ্যালো") ||
    text.includes("assalamualaikum") ||
    text.includes("আসসালামু")
  ) {
    return `${firstQuestionGreeting}${prefix}কী জানতে চান? Product, price, delivery বা shopping নিয়ে আমি help করতে পারি।`;
  }

  if (
    text === "thank you" ||
    text === "thanks" ||
    text.includes("ধন্যবাদ") ||
    text.includes("thankyou")
  ) {
    return `${prefix}Welcome। Help করতে পেরে আনন্দিত।`;
  }

  if (
    text === "hmm" ||
    text === "umm" ||
    text === "hmmm" ||
    text === "ohh" ||
    text === "oh" ||
    text === "okay" ||
    text === "ok" ||
    text === "আচ্ছা" ||
    text === "হুম" ||
    text === "উম"
  ) {
    return `${prefix}জি। আপনি চাইলে যেটা জানতে চান সরাসরি বলুন।`;
  }

  if (
    text.includes("who are you") ||
    text.includes("তুমি কে") ||
    text.includes("তোমার নাম") ||
    text.includes("your name")
  ) {
    return `${prefix}আমি Jihad — KULAURA BAZAR-এর shopping assistant। Product খোঁজা, price, delivery, return policy এবং shopping information নিয়ে আমি help করতে পারি।`;
  }

  if (
    text.includes("where") ||
    text.includes("location") ||
    text.includes("address") ||
    text.includes("কোথায়") ||
    text.includes("কোথায়") ||
    text.includes("ঠিকানা") ||
    text.includes("লোকেশন") ||
    text.includes("দোকান")
  ) {
    return `${prefix}KULAURA BAZAR-এর shop Chowdhury Bazar, Kulaura Upazila-এর Azad Complex Building-এর Ground Floor-এ।`;
  }

  if (
    text.includes("founder") ||
    text.includes("owner") ||
    text.includes("managing director") ||
    text.includes("md") ||
    text.includes("প্রতিষ্ঠাতা") ||
    text.includes("মালিক") ||
    text.includes("জিহাদুর")
  ) {
    return `${prefix}KULAURA BAZAR-এর Founder & Managing Director হলেন Jihadur Rahman। আর আমি Jihad, এই website-এর shopping assistant।`;
  }

  if (
    text.includes("delivery") ||
    text.includes("deliver") ||
    text.includes("ডেলিভারি") ||
    text.includes("পৌঁছ") ||
    text.includes("কতক্ষণে")
  ) {
    return `${prefix}বর্তমানে Kulaura এবং আশেপাশের এলাকায় delivery করা হচ্ছে। Premium delivery সাধারণত প্রায় 30 মিনিটের মধ্যে, আর Average delivery সাধারণত 8 ঘণ্টার মধ্যে।`;
  }

  if (
    text.includes("delivery charge") ||
    text.includes("delivery fee") ||
    text.includes("ডেলিভারি চার্জ") ||
    text.includes("ডেলিভারি ফি")
  ) {
    return `${prefix}Premium delivery সাধারণত ৳30। তবে qualifying order হলে Premium delivery free হতে পারে। Average delivery বর্তমানে free।`;
  }

  if (
    text.includes("premium delivery") ||
    text.includes("premium")
  ) {
    return `${prefix}Premium delivery দ্রুত delivery option। সাধারণত প্রায় 30 মিনিটের মধ্যে delivery দেওয়ার লক্ষ্য থাকে।`;
  }

  if (
    text.includes("average delivery") ||
    text.includes("average")
  ) {
    return `${prefix}Average delivery free এবং সাধারণত 8 ঘণ্টার মধ্যে delivery দেওয়ার লক্ষ্য থাকে।`;
  }

  if (
    text.includes("outside kulaura") ||
    text.includes("কুলাউরার বাইরে") ||
    text.includes("kulaura এর বাইরে") ||
    text.includes("কুলাউরা বাইরে")
  ) {
    return `${prefix}বর্তমানে আমাদের delivery service মূলত Kulaura এবং আশেপাশের এলাকার জন্য।`;
  }

  if (
    text.includes("return") ||
    text.includes("রিটার্ন") ||
    text.includes("ফেরত") ||
    text.includes("exchange")
  ) {
    return `${prefix}Return policy product-এর condition এবং product type-এর ওপর নির্ভর করে। Product ফেরত দেওয়ার আগে order details ও product condition check করা হবে।`;
  }

  if (
    text.includes("payment") ||
    text.includes("pay") ||
    text.includes("bkash") ||
    text.includes("বিকাশ") ||
    text.includes("পেমেন্ট") ||
    text.includes("cash")
  ) {
    return `${prefix}Payment-এর জন্য Cash on Delivery, bKash এবং Bangla QR option রাখা হয়েছে।`;
  }

  if (
    text.includes("cash on delivery") ||
    text.includes("cod")
  ) {
    return `${prefix}জি, Cash on Delivery available আছে।`;
  }

  if (
    text.includes("bkash")
  ) {
    return `${prefix}জি, bKash payment option আছে।`;
  }

  if (
    text.includes("bangla qr") ||
    text.includes("qr")
  ) {
    return `${prefix}জি, Bangla QR payment option-ও রাখা হয়েছে।`;
  }

  if (
    text.includes("teer") &&
    (
      text.includes("oil") ||
      text.includes("তেল") ||
      text.includes("soybean") ||
      text.includes("সয়াবিন")
    )
  ) {
    return `${prefix}Teer Advanced Soybean Oil-এর current listed price ৳890 per litre।`;
  }

  if (
    text.includes("garlic") ||
    text.includes("রসুন")
  ) {
    return `${prefix}Garlic-এর current listed price ৳180 per kg।`;
  }

  if (
    text.includes("potato") ||
    text.includes("আলু")
  ) {
    return `${prefix}Potato-এর current listed price ৳30 per kg।`;
  }

  if (
    text.includes("onion") ||
    text.includes("পেঁয়াজ")
  ) {
    return `${prefix}Onion-এর current listed price ৳60 per kg।`;
  }

  if (
    text.includes("milk") ||
    text.includes("marks") ||
    text.includes("milk powder") ||
    text.includes("দুধ")
  ) {
    return `${prefix}Marks Milk Powder-এর available pack sizes হলো 100g, 250g, 500g এবং 1kg। আপনি চাইলে নির্দিষ্ট pack-এর price জানতে পারেন।`;
  }

  if (
    text.includes("100g") &&
    (
      text.includes("milk") ||
      text.includes("marks")
    )
  ) {
    return `${prefix}Marks Milk Powder 100g pack-এর listed price ৳100।`;
  }

  if (
    text.includes("250g") &&
    (
      text.includes("milk") ||
      text.includes("marks")
    )
  ) {
    return `${prefix}Marks Milk Powder 250g pack-এর listed price ৳235।`;
  }

  if (
    text.includes("500g") &&
    (
      text.includes("milk") ||
      text.includes("marks")
    )
  ) {
    return `${prefix}Marks Milk Powder 500g pack-এর listed price ৳455।`;
  }

  if (
    text.includes("1kg") &&
    (
      text.includes("milk") ||
      text.includes("marks")
    )
  ) {
    return `${prefix}Marks Milk Powder 1kg pack-এর listed price ৳910।`;
  }

  if (
    text.includes("tea") ||
    text.includes("চা") ||
    text.includes("seylon") ||
    text.includes("ceylon")
  ) {
    return `${prefix}Seylon Tea-এর available pack sizes হলো 100g, 250g এবং 500g। আপনি চাইলে নির্দিষ্ট pack-এর price জানতে পারেন।`;
  }

  if (
    text.includes("100g") &&
    (
      text.includes("tea") ||
      text.includes("চা") ||
      text.includes("seylon") ||
      text.includes("ceylon")
    )
  ) {
    return `${prefix}Seylon Tea 100g pack-এর listed price ৳60।`;
  }

  if (
    text.includes("250g") &&
    (
      text.includes("tea") ||
      text.includes("চা") ||
      text.includes("seylon") ||
      text.includes("ceylon")
    )
  ) {
    return `${prefix}Seylon Tea 250g pack-এর listed price ৳120।`;
  }

  if (
    text.includes("500g") &&
    (
      text.includes("tea") ||
      text.includes("চা") ||
      text.includes("seylon") ||
      text.includes("ceylon")
    )
  ) {
    return `${prefix}Seylon Tea 500g pack-এর listed price ৳230।`;
  }

  if (
    text.includes("price") ||
    text.includes("দাম") ||
    text.includes("কত টাকা") ||
    text.includes("মূল্য")
  ) {
    return `${prefix}কোন product-এর price জানতে চান? Product-এর নাম বললে আমি available information অনুযায়ী price জানাতে পারি।`;
  }

  if (
    text.includes("order") ||
    text.includes("অর্ডার")
  ) {
    return `${prefix}Product select করে quantity/pack size ঠিক করুন, তারপর Cart-এ add করে Checkout থেকে order complete করতে পারবেন।`;
  }

  if (
    text.includes("cart") ||
    text.includes("কার্ট")
  ) {
    return `${prefix}Product-এর পাশে Add to Cart option ব্যবহার করে product Cart-এ যোগ করতে পারবেন। এরপর Cart থেকে quantity review করে Checkout করতে পারবেন।`;
  }

  if (
    text.includes("about") ||
    text.includes("company") ||
    text.includes("business") ||
    text.includes("কোম্পানি") ||
    text.includes("সম্পর্কে")
  ) {
    return `${prefix}KULAURA BAZAR হলো Kulaura-focused online shopping platform। এখানে everyday grocery ও প্রয়োজনীয় household products সহজে order করার লক্ষ্য রাখা হয়েছে।`;
  }

  if (
    text.includes("product") ||
    text.includes("products") ||
    text.includes("কি আছে") ||
    text.includes("কী আছে") ||
    text.includes("কী কী") ||
    text.includes("কি কি")
  ) {
    return `${prefix}Grocery, Beauty, Stationery, Dairy & Bakery, Soft Drinks, Home Essentials, Baby Care এবং Other category-তে products পাওয়া যাবে।`;
  }

  if (
    text.includes("shopping") ||
    text.includes("কেনাকাটা")
  ) {
    return `${prefix}অবশ্যই। আপনি product-এর নাম বলুন, অথবা category থেকে browse করে shopping শুরু করতে পারেন।`;
  }

  return `${prefix}হুম, এটা আমি help করতে পারি। Product, price, quantity, delivery, return policy, payment বা location—যেটা জানতে চান সেটা একটু specific করে লিখুন।`;
}

export default function AIShoppingAssistant() {
  const [position, setPosition] =
    useState<Position>(DEFAULT_POSITION);

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const [hasAskedFirstQuestion, setHasAskedFirstQuestion] =
    useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: INITIAL_MESSAGE,
    },
  ]);

  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile>({
      name: "",
      gender: null,
    });

  const [showGenderPoll, setShowGenderPoll] =
    useState(false);

  const [waitingForName, setWaitingForName] =
    useState(true);

  const [showTeaser, setShowTeaser] = useState(true);

  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  /*
   * --------------------------------------------------
   * Initial position + profile
   * --------------------------------------------------
   */

  useEffect(() => {
    try {
      const savedPosition =
        localStorage.getItem(
          "kulaura-ai-position",
        );

      const savedProfile =
        localStorage.getItem(
          "kulaura-ai-profile",
        );

      if (savedPosition) {
        const parsed = JSON.parse(
          savedPosition,
        ) as Position;

        if (
          typeof parsed.x === "number" &&
          typeof parsed.y === "number"
        ) {
          setPosition(parsed);
        }
      }

      if (savedProfile) {
        const parsed = JSON.parse(
          savedProfile,
        ) as CustomerProfile;

        if (
          parsed &&
          typeof parsed.name === "string"
        ) {
          setCustomerProfile({
            name: parsed.name,
            gender:
              parsed.gender === "male" ||
              parsed.gender === "female"
                ? parsed.gender
                : null,
          });

          setWaitingForName(false);
        }
      }
    } catch {
      // Ignore corrupted localStorage data.
    }
  }, []);

  /*
   * --------------------------------------------------
   * Save position
   * --------------------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        "kulaura-ai-position",
        JSON.stringify(position),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [position]);

  /*
   * --------------------------------------------------
   * Save customer profile
   * --------------------------------------------------
   */

  useEffect(() => {
    try {
      if (customerProfile.name) {
        localStorage.setItem(
          "kulaura-ai-profile",
          JSON.stringify(customerProfile),
        );
      }
    } catch {
      // Ignore storage errors.
    }
  }, [customerProfile]);

  /*
   * --------------------------------------------------
   * Welcome teaser
   *
   * Shows once when page loads.
   * Automatically disappears after 3.5 seconds.
   * Scrolling hides it immediately.
   * --------------------------------------------------
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowTeaser(false);
    }, 3500);

    const handleScroll = () => {
      setShowTeaser(false);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /*
   * --------------------------------------------------
   * Scroll to latest chat message
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    messages,
    isTyping,
    isOpen,
    showGenderPoll,
  ]);

  /*
   * --------------------------------------------------
   * Dynamic suggestions
   * --------------------------------------------------
   */

  const liveSuggestions = useMemo(() => {
    return getSuggestions(message);
  }, [message]);

  /*
   * --------------------------------------------------
   * Drag helpers
   * --------------------------------------------------
   */

  const clampPosition = (
    x: number,
    y: number,
  ): Position => {
    if (typeof window === "undefined") {
      return DEFAULT_POSITION;
    }

    const buttonSize = 58;

    const minX = 8;

    const maxX = Math.max(
      8,
      window.innerWidth -
        buttonSize -
        8,
    );

    const minY = 70;

    const maxY = Math.max(
      70,
      window.innerHeight -
        buttonSize -
        90,
    );

    return {
      x: Math.min(
        Math.max(x, minX),
        maxX,
      ),
      y: Math.min(
        Math.max(y, minY),
        maxY,
      ),
    };
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (isOpen) {
      return;
    }

    dragRef.current.active = true;

    dragRef.current.offsetX =
      event.clientX - position.x;

    dragRef.current.offsetY =
      event.clientY - position.y;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !dragRef.current.active ||
      isOpen
    ) {
      return;
    }

    const nextPosition =
      clampPosition(
        event.clientX -
          dragRef.current.offsetX,
        event.clientY -
          dragRef.current.offsetY,
      );

    setPosition(nextPosition);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!dragRef.current.active) {
      return;
    }

    dragRef.current.active = false;

    setIsDragging(false);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    } catch {
      // Ignore pointer capture errors.
    }
  };

  /*
   * --------------------------------------------------
   * Open AI
   * --------------------------------------------------
   */

  const openAssistant = () => {
    setShowTeaser(false);
    setIsOpen(true);
  };

  /*
   * --------------------------------------------------
   * Close AI
   * --------------------------------------------------
   */

  const closeAssistant = () => {
    setIsOpen(false);
  };

  /*
   * --------------------------------------------------
   * Reset conversation
   * --------------------------------------------------
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

    setWaitingForName(
      customerProfile.name.length === 0,
    );
  };

  /*
   * --------------------------------------------------
   * Gender selection
   * --------------------------------------------------
   */

  const selectGender = (
    gender: Gender,
  ) => {
    setCustomerProfile((current) => ({
      ...current,
      gender,
    }));

    setShowGenderPoll(false);

    const name =
      customerProfile.name;

    const title =
      gender === "male"
        ? `${name} Sir`
        : gender === "female"
          ? `${name} Mam`
          : name;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "assistant",
        text:
          gender === null
            ? `ঠিক আছে${name ? `, ${name}` : ""}। আমরা normalভাবেই কথা বলব।`
            : `Nice to meet you, ${title}। এখন আপনি যেকোনো প্রশ্ন করতে পারেন।`,
      },
    ]);
  };

  /*
   * --------------------------------------------------
   * Send message
   * --------------------------------------------------
   */

  const submitMessage = (
    event?: FormEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();

    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      isTyping
    ) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setMessage("");

    /*
     * -----------------------------------------------
     * Name collection
     * -----------------------------------------------
     */

    if (
      waitingForName &&
      !customerProfile.name &&
      !looksLikeQuestion(trimmedMessage) &&
      trimmedMessage.length <= 50
    ) {
      const extractedName =
        normalizeName(trimmedMessage);

      /*
       * Prevent storing obvious filler words
       * as customer's name.
       */

      const invalidNames = [
        "yes",
        "no",
        "okay",
        "ok",
        "hmm",
        "umm",
        "oh",
        "ohh",
        "hi",
        "hello",
        "হুম",
        "আচ্ছা",
        "জি",
        "না",
      ];

      const isInvalidName =
        invalidNames.includes(
          extractedName.toLowerCase(),
        );

      if (
        extractedName &&
        !isInvalidName &&
        extractedName.length <= 35
      ) {
        const newProfile: CustomerProfile = {
          name: extractedName,
          gender: null,
        };

        setCustomerProfile(
          newProfile,
        );

        setWaitingForName(false);

        setIsTyping(true);

        window.setTimeout(() => {
          setIsTyping(false);

          setMessages((current) => [
            ...current,
            {
              id: Date.now(),
              role: "assistant",
              text: `Nice to meet you, ${extractedName}। আপনি চাইলে আপনার gender select করতে পারেন, অথবা Skip করতে পারেন।`,
            },
          ]);

          setShowGenderPoll(true);
        }, 650);

        return;
      }
    }

    /*
     * -----------------------------------------------
     * Normal question
     * -----------------------------------------------
     */

    const isFirstQuestion =
      !hasAskedFirstQuestion;

    setHasAskedFirstQuestion(true);

    setIsTyping(true);

    const reply =
      getDemoReply(
        trimmedMessage,
        customerProfile,
        isFirstQuestion,
      );

    window.setTimeout(() => {
      setIsTyping(false);

      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          role: "assistant",
          text: reply,
        },
      ]);
    }, 650);
  };

  /*
   * --------------------------------------------------
   * Suggestion click
   * --------------------------------------------------
   */

  const selectSuggestion = (
    suggestion: string,
  ) => {
    setMessage(suggestion);
  };

  /*
   * --------------------------------------------------
   * Teaser placement
   *
   * If AI is near the left side:
   *   teaser appears on right.
   *
   * If AI is near the right side:
   *   teaser appears on left.
   * --------------------------------------------------
   */

  const teaserOnLeft =
    typeof window !== "undefined"
      ? position.x >
        window.innerWidth / 2
      : false;

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <>
      {/* Floating AI Launcher + Teaser */}
      {!isOpen && (
        <div
          className="fixed z-[100]"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {/* Welcome teaser */}
          <div
            aria-hidden={!showTeaser}
            className={[
              "pointer-events-none absolute top-1/2",
              "w-[158px] -translate-y-1/2",
              "transition-all duration-500 ease-out",
              showTeaser
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0",
              teaserOnLeft
                ? "right-[66px]"
                : "left-[66px]",
              showTeaser
                ? "translate-x-0"
                : teaserOnLeft
                  ? "translate-x-2"
                  : "-translate-x-2",
            ].join(" ")}
          >
            <div
              className={[
                "relative rounded-2xl",
                "border border-[#dfe7e1]",
                "bg-white px-3.5 py-2.5",
                "shadow-[0_8px_30px_rgba(23,33,27,0.12)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef5ef]">
                  <Sparkles
                    size={14}
                    strokeWidth={2}
                    className="text-[#356a47]"
                  />
                </div>

                <span className="whitespace-nowrap text-[13px] font-semibold tracking-[-0.01em] text-[#17211b]">
                  Ask any question
                </span>
              </div>

              {/* Small speech-bubble tail */}
              <span
                className={[
                  "absolute top-1/2 h-3 w-3",
                  "-translate-y-1/2 rotate-45",
                  "border bg-white",
                  teaserOnLeft
                    ? "-right-1.5 border-r-[#dfe7e1] border-t-[#dfe7e1] border-b-0 border-l-0"
                    : "-left-1.5 border-b-[#dfe7e1] border-l-[#dfe7e1] border-t-0 border-r-0",
                ].join(" ")}
              />
            </div>
          </div>

          {/* AI button */}
          <button
            type="button"
            aria-label="Open Jihad AI Shopping Assistant"
            aria-haspopup="dialog"
            onClick={openAssistant}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={[
              "relative flex h-[58px] w-[58px]",
              "touch-none select-none items-center justify-center",
              "rounded-full border border-white/20",
              "bg-[#356a47] text-white",
              "shadow-[0_8px_30px_rgba(53,106,71,0.32)]",
              "transition-all duration-200",
              "hover:scale-[1.04]",
              "active:scale-95",
              isDragging
                ? "cursor-grabbing scale-105"
                : "cursor-grab",
            ].join(" ")}
          >
            <Bot
              size={27}
              strokeWidth={1.8}
            />

            {/* Online indicator */}
            <span className="absolute right-[3px] top-[3px] h-3 w-3 rounded-full border-2 border-[#356a47] bg-[#76b68a]" />
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={[
            "fixed inset-x-3 bottom-3 z-[110]",
            "mx-auto w-auto max-w-[430px]",
            "overflow-hidden rounded-[24px]",
            "border border-[#dfe7e1]",
            "bg-[#f7f8f5]",
            "shadow-[0_20px_70px_rgba(23,33,27,0.20)]",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Jihad AI Shopping Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#356a47] px-4 py-3.5 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Bot
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[14px] font-semibold">
                    Jihad
                  </p>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#9ad1a7]" />
                </div>

                <p className="truncate text-[11px] text-white/75">
                  KULAURA BAZAR AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Reset conversation"
                title="Reset conversation"
                onClick={resetChat}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                aria-label="Close assistant"
                title="Close"
                onClick={closeAssistant}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X
                  size={19}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[390px] overflow-y-auto px-3 py-4 sm:h-[430px]">
            <div className="space-y-3">
              {messages.map((chatMessage) => {
                const isAssistant =
                  chatMessage.role ===
                  "assistant";

                return (
                  <div
                    key={chatMessage.id}
                    className={[
                      "flex",
                      isAssistant
                        ? "justify-start"
                        : "justify-end",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[84%] rounded-2xl px-3.5 py-2.5",
                        "text-[13px] leading-[1.55]",
                        "whitespace-pre-line",
                        isAssistant
                          ? "rounded-tl-md border border-[#e0e7e1] bg-white text-[#273229]"
                          : "rounded-tr-md bg-[#356a47] text-white",
                      ].join(" ")}
                    >
                      {chatMessage.text}
                    </div>
                  </div>
                );
              })}

              {/* Gender poll */}
              {showGenderPoll && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-[#e0e7e1] bg-white p-3">
                    <div className="mb-2.5 flex items-center gap-2">
                      <UserRound
                        size={15}
                        className="text-[#356a47]"
                      />

                      <span className="text-[12px] font-semibold text-[#273229]">
                        আপনি চাইলে gender select করতে পারেন
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          selectGender(
                            "male",
                          )
                        }
                        className="rounded-xl border border-[#dce5de] bg-[#f7f8f5] px-3 py-2 text-[12px] font-medium text-[#273229] transition hover:border-[#356a47] hover:bg-[#eef5ef]"
                      >
                        Male
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          selectGender(
                            "female",
                          )
                        }
                        className="rounded-xl border border-[#dce5de] bg-[#f7f8f5] px-3 py-2 text-[12px] font-medium text-[#273229] transition hover:border-[#356a47] hover:bg-[#eef5ef]"
                      >
                        Female
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          selectGender(
                            null,
                          )
                        }
                        className="rounded-xl border border-[#dce5de] bg-[#f7f8f5] px-3 py-2 text-[12px] font-medium text-[#273229] transition hover:border-[#356a47] hover:bg-[#eef5ef]"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-[#e0e7e1] bg-white px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#789080]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#789080] [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#789080] [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Suggested prompts */}
          <div className="border-t border-[#e0e7e1] bg-[#f7f8f5] px-3 pb-2 pt-2.5">
            <div className="mb-2 flex items-center gap-1.5">
              <Sparkles
                size={13}
                className="text-[#356a47]"
                strokeWidth={1.8}
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b786f]">
                Suggestions
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {liveSuggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      selectSuggestion(
                        suggestion,
                      )
                    }
                    className="shrink-0 rounded-full border border-[#d9e3dc] bg-white px-3 py-1.5 text-[11px] font-medium text-[#356a47] transition hover:border-[#356a47] hover:bg-[#eef5ef]"
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
            className="border-t border-[#e0e7e1] bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-[#dce4de] bg-[#f8faf8] p-1.5 transition focus-within:border-[#356a47] focus-within:ring-2 focus-within:ring-[#356a47]/10">
              <MessageCircle
                size={17}
                className="ml-2 shrink-0 text-[#8a968d]"
                strokeWidth={1.7}
              />

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value,
                  )
                }
                placeholder="Ask a question..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[13px] text-[#17211b] outline-none placeholder:text-[#9aa49d]"
                autoComplete="off"
                aria-label="Ask Jihad a question"
              />

              <button
                type="submit"
                disabled={
                  !message.trim() ||
                  isTyping
                }
                aria-label="Send message"
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  "bg-[#356a47] text-white",
                  "transition-all duration-200",
                  "hover:bg-[#2d5d3e]",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                ].join(" ")}
              >
                <Send
                  size={16}
                  strokeWidth={1.9}
                />
              </button>
            </div>

            <p className="mt-2 text-center text-[9px] text-[#9aa49d]">
              KULAURA BAZAR Shopping Assistant
            </p>
          </form>
        </div>
      )}
    </>
  );
}