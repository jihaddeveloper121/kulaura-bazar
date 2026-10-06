"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Apple,
  Baby,
  BookOpen,
  ChevronRight,
  CupSoda,
  House,
  Menu,
  Milk,
  MoreHorizontal,
  Search,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { products, type Product } from "@/lib/products";
import { getCartCount } from "@/lib/cart";
import ProductCard from "@/components/ProductCard";
import MenuPanel from "@/components/MenuPanel";

const heroImages = [
  "/hero-kulaura-1.jpg",
  "/hero-kulaura-2.jpg",
  "/hero-kulaura-3.jpg",
];

const categories = [
  {
    name: "Grocery",
    image: "/categories/grocery.jpg",
    icon: Apple,
  },
  {
    name: "Beauty",
    image: "/categories/beauty.jpg",
    icon: Sparkles,
  },
  {
    name: "Stationery",
    image: "/categories/stationery.jpg",
    icon: BookOpen,
  },
  {
    name: "Dairy & Bakery",
    image: "/categories/dairy-bakery.jpg",
    icon: Milk,
  },
  {
    name: "Soft Drinks",
    image: "/categories/soft-drinks.jpg",
    icon: CupSoda,
  },
  {
    name: "Home Essentials",
    image: "/categories/home-essentials.jpg",
    icon: House,
  },
  {
    name: "Baby Care",
    image: "/categories/baby-care.jpg",
    icon: Baby,
  },
  {
    name: "Other",
    image: "/categories/other.jpg",
    icon: MoreHorizontal,
  },
];

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  /*
   * CART COUNT
   */
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

  /*
   * HERO SLIDER
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /*
   * SEARCH SUGGESTIONS
   */
  const searchSuggestions = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return [];
    }

    return products
      .filter((product) => {
        if (product.status === "archived") {
          return false;
        }

        const keywords = Array.isArray(product.keywords)
          ? product.keywords
          : [];

        const searchTerms = Array.isArray(product.searchTerms)
          ? product.searchTerms
          : [];

        const searchableText = [
          product.name,
          product.shortText,
          product.category,
          product.section,
          product.productType,
          product.brand ?? "",
          ...keywords,
          ...searchTerms,
        ]
          .map(normalizeText)
          .join(" ");

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 5);
  }, [search]);

  /*
   * SUGGESTED PRODUCTS
   */
  const suggestedProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.status === "active" &&
          product.suggestedProduct
      )
      .slice(0, 8);
  }, []);

  /*
   * DISCOUNT PRODUCTS
   */
  const discountProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.status === "active" &&
          product.discountProduct
      )
      .slice(0, 8);
  }, []);

  /*
   * MONTHLY BAZAR PRODUCTS
   */
  const monthlyBazarProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.status === "active" &&
          product.monthlyBazar
      )
      .slice(0, 8);
  }, []);

  /*
   * CLEAR SEARCH
   */
  const clearSearch = () => {
    setSearch("");
    searchRef.current?.focus();
  };

  /*
   * GO TO SEARCH
   */
  const goToSearch = () => {
    const value = search.trim();

    if (!value) {
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden pb-24">

        {/* ================= HEADER ================= */}
        <header className="relative flex h-[68px] items-center justify-center px-4">

          {/* MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-black/5"
            aria-label="Open menu"
          >
            <Menu
              size={23}
              strokeWidth={1.8}
            />
          </button>

          {/* LOGO */}
          <Link
            href="/"
            className="relative h-[58px] w-[150px]"
          >
            <Image
              src="/logo.svg"
              alt="KULAURA BAZAR"
              fill
              sizes="150px"
              priority
              className="object-contain"
            />
          </Link>

          {/* CART */}
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
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e07a24] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </header>

        {/* ================= HERO ================= */}
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
                  sizes="(max-width: 480px) 100vw, 480px"
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

                <div className="flex h-[58px] items-center rounded-2xl border border-black/5 bg-white px-4 shadow-[0_8px_25px_rgba(0,0,0,0.12)]">

                  <Search
                    size={19}
                    className="shrink-0 text-[#777]"
                    strokeWidth={1.8}
                  />

                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setSearchFocused(true);
                    }}
                    onFocus={() => {
                      setSearchFocused(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        goToSearch();
                      }

                      if (event.key === "Escape") {
                        setSearchFocused(false);
                      }
                    }}
                    placeholder="Search products, brands and shops..."
                    autoComplete="off"
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
                  search.trim() &&
                  searchSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[64px] z-30 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">

                      {searchSuggestions.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setSearchFocused(false);
                          }}
                          className="flex w-full items-center gap-3 border-b border-black/5 px-3 py-3 last:border-b-0"
                        >

                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f5f3ee]">

                            <Image
                              src={
                                product.primaryImage ||
                                product.image
                              }
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-contain"
                            />

                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-left text-[12px] font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-left text-[10px] text-[#888]">
                              {product.brand
                                ? `${product.brand} · `
                                : ""}
                              {product.category}
                            </p>

                          </div>

                          <ChevronRight
                            size={16}
                            className="text-[#999]"
                          />

                        </Link>
                      ))}

                      <Link
                        href={`/search?q=${encodeURIComponent(
                          search.trim()
                        )}`}
                        className="flex items-center justify-center border-t border-black/5 px-4 py-3 text-[11px] font-semibold text-[#356a47]"
                        onClick={() => {
                          setSearchFocused(false);
                        }}
                      >
                        See all search results
                      </Link>

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
                    ? "w-5 bg-[#356a47]"
                    : "w-1.5 bg-[#c7c7c7]"
                }`}
              />
            ))}

          </div>

        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="mt-7 px-4">

          <div className="flex items-center justify-between">

            <h2 className="text-[16px] font-bold">
              Categories
            </h2>

            {categories.length > 8 && (
              <button
                type="button"
                onClick={() =>
                  setShowAllCategories((current) => !current)
                }
                className="text-[11px] font-semibold text-[#356a47]"
              >
                {showAllCategories
                  ? "Show less"
                  : "Show more"}
              </button>
            )}

          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">

            {(showAllCategories
              ? categories
              : categories.slice(0, 8)
            ).map((category) => {

              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/category/${encodeURIComponent(
                    category.name.toLowerCase()
                  )}`}
                  className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white"
                >

                  <div className="relative aspect-square overflow-hidden bg-[#eef0eb]">

                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 480px) 25vw, 120px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/15" />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-2 pb-2 pt-7">

                      <div className="flex items-center gap-1.5 text-white">

                        <Icon
                          size={13}
                          strokeWidth={1.8}
                        />

                        <span className="text-[9px] font-semibold leading-tight">
                          {category.name}
                        </span>

                      </div>

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        </section>

        {/* ================= PRODUCT SECTIONS ================= */}

        <ProductSection
          title="Suggested Products"
          products={suggestedProducts}
          href="/products?section=suggested"
        />

        <ProductSection
          title="Discount Products"
          products={discountProducts}
          href="/products?section=discount"
        />

        <ProductSection
          title="Monthly Bazar"
          products={monthlyBazarProducts}
          href="/products?section=monthly-bazar"
        />

        {/* ================= BOTTOM NAV ================= */}

        <nav className="fixed bottom-0 left-1/2 z-40 flex h-[68px] w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-black/5 bg-white/95 px-3 backdrop-blur">

          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-[#356a47]"
          >
            <House
              size={20}
              strokeWidth={1.8}
            />

            <span className="text-[9px] font-semibold">
              Home
            </span>
          </Link>

          <Link
            href="/search"
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <Search
              size={20}
              strokeWidth={1.8}
            />

            <span className="text-[9px] font-medium">
              Search
            </span>
          </Link>

          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <HeartIcon />

            <span className="text-[9px] font-medium">
              Wishlist
            </span>
          </Link>

          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 text-[#777]"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.8}
            />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e07a24] px-1 text-[8px] font-bold text-white">
                {cartCount}
              </span>
            )}

            <span className="text-[9px] font-medium">
              Cart
            </span>
          </Link>

          <Link
            href="/account"
            className="flex flex-col items-center gap-1 text-[#777]"
          >
            <UserIcon />

            <span className="text-[9px] font-medium">
              Account
            </span>
          </Link>

        </nav>

        {/* ================= MENU PANEL ================= */}

        <MenuPanel
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

      </div>
    </main>
  );
}

/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection({
  title,
  products: sectionProducts,
  href,
}: {
  title: string;
  products: Product[];
  href: string;
}) {
  if (sectionProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">

      <div className="flex items-center justify-between px-4">

        <h2 className="text-[16px] font-bold">
          {title}
        </h2>

        <Link
          href={href}
          className="text-[11px] font-semibold text-[#356a47]"
        >
          See more
        </Link>

      </div>

      <div className="mt-4 overflow-x-auto px-4 scrollbar-none">

        <div className="grid w-max grid-flow-col grid-rows-2 gap-3">

          {sectionProducts.map((product) => (
            <div
              key={product.id}
              className="w-[168px]"
            >
              <ProductCard product={product} />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   HEART ICON
========================================================= */

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

/* =========================================================
   USER ICON
========================================================= */

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4 21c0-4.42 3.58-8 8-8s8 3.58 8 8" />
    </svg>
  );
}