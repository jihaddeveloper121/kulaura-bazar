"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  ShoppingCart,
  Search,
  Heart,
  Home,
  User,
  ChevronRight,
  X,
  BookOpen,
  Milk,
  CupSoda,
  Sparkles,
  Baby,
  House,
  Apple,
  MoreHorizontal,
} from "lucide-react";

import {
  products,
  type Product,
} from "@/lib/products";

import {
  addToCart as addProductToCart,
  getCartCount,
} from "@/lib/cart";

const heroImages = [
  "/hero-kulaura-1.jpg",
  "/hero-kulaura-2.jpg",
  "/hero-kulaura-3.jpg",
];

const categories = [
  {
    name: "Grocery",
    icon: Apple,
  },
  {
    name: "Beauty",
    icon: Sparkles,
  },
  {
    name: "Stationery",
    icon: BookOpen,
  },
  {
    name: "Dairy & Bakery",
    icon: Milk,
  },
  {
    name: "Soft Drinks",
    icon: CupSoda,
  },
  {
    name: "Home Essentials",
    icon: House,
  },
  {
    name: "Baby Care",
    icon: Baby,
  },
  {
    name: "Other",
    icon: MoreHorizontal,
  },
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getDefaultCartQuantity(product: Product) {
  if (product.unit === "kg") {
    return 1000;
  }

  return 1;
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedProduct, setAddedProduct] = useState<number | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      if (!normalizedSearch) {
        return matchesCategory;
      }

      const searchableText = [
        product.name,
        product.category,
        ...product.searchTerms,
      ]
        .map(normalizeText)
        .join(" ");

      return (
        matchesCategory &&
        searchableText.includes(normalizedSearch)
      );
    });
  }, [search, selectedCategory]);

  const searchSuggestions = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return [];
    }

    return products
      .filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          ...product.searchTerms,
        ]
          .map(normalizeText)
          .join(" ");

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 5);
  }, [search]);

  const addToCart = (productId: number) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    const defaultQuantity = getDefaultCartQuantity(product);

    addProductToCart(productId, defaultQuantity);

    setCartCount(getCartCount());

    setAddedProduct(productId);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1200);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const selectSuggestion = (product: Product) => {
    setSearch(product.name);
    setSearchFocused(false);
  };

  const clearSearch = () => {
    setSearch("");
    searchRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#222]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#f8f6f1] pb-24">

        {/* HEADER */}
        <header className="relative flex h-[68px] items-center justify-center px-4">
          <button
            type="button"
            className="absolute left-4 flex h-10 w-10 items-center justify-center"
            aria-label="Open menu"
          >
            <Menu size={23} strokeWidth={1.8} />
          </button>

          <Link
            href="/"
            className="relative h-[58px] w-[150px]"
          >
            <Image
              src="/logo.svg"
              alt="KULAURA BAZAR"
              fill
              priority
              className="object-contain"
            />
          </Link>

          <Link
            href="/cart"
            className="absolute right-4 flex h-10 w-10 items-center justify-center"
            aria-label="Cart"
          >
            <ShoppingCart
              size={23}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e47b32] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </header>

        {/* HERO */}
        <section className="px-4 pt-1">
          <div className="relative h-[175px] overflow-visible rounded-[22px]">

            {heroImages.map((image, index) => (
              <div
                key={image}
                className={`absolute inset-0 overflow-hidden rounded-[22px] transition-opacity duration-700 ${
                  activeHero === index
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`Kulaura Bazar ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute left-5 top-5 text-white">
                  <p className="text-[10px] font-medium tracking-[0.15em]">
                    LOCATION - AZAD COMPLEX
                  </p>

                  <h1 className="mt-2 text-[27px] font-semibold leading-none">
                    Happy
                    <br />
                    Shopping
                  </h1>
                </div>
              </div>
            ))}

            {/* SEARCH */}
            <div className="absolute -bottom-7 left-4 right-4 z-20">
              <div className="relative">

                <div className="flex h-[52px] items-center rounded-2xl border border-black/5 bg-white px-4 shadow-[0_8px_25px_rgba(0,0,0,0.12)]">

                  <Search
                    size={19}
                    className="shrink-0 text-[#777]"
                    strokeWidth={1.8}
                  />

                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    onFocus={() =>
                      setSearchFocused(true)
                    }
                    placeholder="Search products..."
                    className="ml-3 h-full w-full bg-transparent text-[13px] outline-none placeholder:text-[#999]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* SEARCH SUGGESTIONS */}
                {searchFocused &&
                  search &&
                  searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[58px] z-30 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">

                      {searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() =>
                            selectSuggestion(product)
                          }
                          className="flex w-full items-center gap-3 border-b border-black/5 px-3 py-3 text-left last:border-b-0"
                        >
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f5f3ee]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#888]">
                              {product.category}
                            </p>
                          </div>

                          <ChevronRight
                            size={16}
                            className="text-[#999]"
                          />
                        </button>
                      ))}
                    </div>
                  )}

              </div>
            </div>
          </div>

          {/* HERO DOTS */}
          <div className="mt-10 flex justify-center gap-1.5">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveHero(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  activeHero === index
                    ? "w-5 bg-[#6f8f52]"
                    : "w-1.5 bg-[#c7c7c7]"
                }`}
              />
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold">
              Categories
            </h2>

            <button
              type="button"
              onClick={() =>
                setSelectedCategory("All")
              }
              className="text-[11px] font-semibold text-[#6f8f52]"
            >
              View All
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive =
                selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      isActive ? "All" : category.name
                    )
                  }
                  className={`flex min-h-[82px] flex-col items-center justify-center rounded-2xl border transition ${
                    isActive
                      ? "border-[#6f8f52] bg-[#eef3e8]"
                      : "border-black/5 bg-white"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.7}
                    className={
                      isActive
                        ? "text-[#55743b]"
                        : "text-[#555]"
                    }
                  />

                  <span className="mt-2 text-center text-[9px] font-medium leading-tight text-[#555]">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="mt-7 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold">
                Popular Products
              </h2>

              {selectedCategory !== "All" && (
                <p className="mt-1 text-[10px] text-[#888]">
                  {selectedCategory}
                </p>
              )}
            </div>

            <span className="text-[10px] text-[#999]">
              {filteredProducts.length} items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-white px-5 py-10 text-center">
              <Search
                size={28}
                className="mx-auto text-[#aaa]"
                strokeWidth={1.5}
              />

              <p className="mt-3 text-[13px] font-semibold">
                No products found
              </p>

              <p className="mt-1 text-[10px] text-[#999]">
                Try another product name or category.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">

              {filteredProducts.map((product) => {
                const isWishlisted =
                  wishlist.includes(product.id);

                const isAdded =
                  addedProduct === product.id;

                return (
                  <div
                    key={product.id}
                    className="relative overflow-hidden rounded-2xl bg-white p-3"
                  >

                    {/* DISCOUNT */}
                    {product.discount && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-[#e47b32] px-2 py-1 text-[8px] font-bold text-white">
                        {product.discount}
                      </span>
                    )}

                    {/* WISHLIST */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlist(product.id)
                      }
                      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
                      aria-label="Wishlist"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.7}
                        className={
                          isWishlisted
                            ? "fill-[#e47b32] text-[#e47b32]"
                            : "text-[#666]"
                        }
                      />
                    </button>

                    {/* IMAGE */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block"
                    >
                      <div className="relative h-[145px] w-full overflow-hidden rounded-xl bg-[#f7f5f0]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* NAME */}
                      <h3 className="mt-3 line-clamp-2 min-h-[32px] text-[11px] font-semibold leading-[16px]">
                        {product.name}
                      </h3>
                    </Link>

                    {/* PRICE */}
                    <div className="mt-2 flex items-center gap-2">
                      {product.price !== null ? (
                        <>
                          <span className="text-[14px] font-bold text-[#222]">
                            ৳{product.price}
                          </span>

                          {product.oldPrice !== null && (
                            <span className="text-[10px] text-[#aaa] line-through">
                              ৳{product.oldPrice}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#777]">
                          Price pending
                        </span>
                      )}
                    </div>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(product.id)
                      }
                      className={`mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-bold text-white transition active:scale-[0.98] ${
                        isAdded
                          ? "bg-[#55743b]"
                          : "bg-[#6f8f52]"
                      }`}
                    >
                      <ShoppingCart
                        size={15}
                        strokeWidth={1.8}
                      />

                      {isAdded
                        ? "Added"
                        : "Add to Cart"}
                    </button>
                  </div>
                );
              })}

            </div>
          )}
        </section>

        {/* BOTTOM NAV */}
        <nav className="fixed bottom-0 left-1/2 z-40 flex h-[68px] w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-black/5 bg-white/95 px-3 backdrop-blur">

          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-[#6f8f52]"
          >
            <Home size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-semibold">
              Home
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              searchRef.current?.focus();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <Search size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-medium">
              Search
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <Heart size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-medium">
              Wishlist
            </span>
          </button>

          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 text-[#777]"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e47b32] px-1 text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}

            <span className="text-[9px] font-medium">
              Cart
            </span>
          </Link>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <User size={20} strokeWidth={1.8} />
            <span className="text-[9px] font-medium">
              Account
            </span>
          </button>

        </nav>
      </div>
    </main>
  );
}