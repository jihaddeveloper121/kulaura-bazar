"use client";

import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(urlQuery);

  useEffect(() => {
    setSearchText(urlQuery);
  }, [urlQuery]);

  const searchResults = useMemo(() => {
    const query = normalizeText(urlQuery);

    if (!query) {
      return [];
    }

    return products.filter((product) => {
      // Archived products search result-এ দেখাবে না
      if (product.status === "archived") {
        return false;
      }

      const keywords = Array.isArray(product.keywords)
        ? product.keywords
        : [];

      const searchTerms = Array.isArray(product.searchTerms)
        ? product.searchTerms
        : [];

      const searchableValues = [
        product.name,
        product.shortText,
        product.category,
        product.section,
        product.productType,
        product.brand,
        product.quality,
        product.color,
        ...keywords,
        ...searchTerms,
      ];

      const searchableText = searchableValues
        .map(normalizeText)
        .filter(Boolean)
        .join(" ");

      return searchableText.includes(query);
    });
  }, [urlQuery]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const clearSearch = () => {
    setSearchText("");
    router.push("/search");
  };

  const searchProduct = (productName: string) => {
    setSearchText(productName);

    router.push(
      `/search?q=${encodeURIComponent(productName)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5] pb-8">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f8f5]/95 backdrop-blur">
          <div className="flex h-[58px] items-center px-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white transition active:scale-95"
            >
              <ArrowLeft
                size={19}
                strokeWidth={2}
              />
            </Link>

            <div className="ml-3">
              <h1 className="text-[17px] font-semibold tracking-[-0.01em]">
                Search
              </h1>

              <p className="mt-[1px] text-[11px] text-black/45">
                Find products quickly
              </p>
            </div>
          </div>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="px-4 pb-3"
          >
            <div className="flex h-[48px] items-center rounded-[15px] border border-black/[0.07] bg-white px-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <Search
                size={19}
                strokeWidth={2}
                className="mr-2.5 shrink-0 text-black/45"
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search products, brands and shops..."
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#17211b] outline-none placeholder:text-black/35"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/45 transition hover:bg-black/[0.04] active:scale-95"
                >
                  <X
                    size={17}
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>
          </form>
        </header>

        {/* Empty search state */}
        {!urlQuery && (
          <section className="px-4 pt-8">
            <div className="mb-6">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em]">
                What are you looking for?
              </h2>

              <p className="mt-1 text-[12px] leading-5 text-black/45">
                Search for products, brands, categories or
                keywords.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40">
                Popular searches
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "Garlic",
                  "Oil",
                  "Teer",
                  "Milk Powder",
                  "Tea",
                  "Sugar",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => searchProduct(item)}
                    className="rounded-full border border-black/[0.07] bg-white px-3.5 py-2 text-[12px] font-medium text-[#17211b] shadow-[0_2px_8px_rgba(0,0,0,0.025)] transition active:scale-[0.97]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search results */}
        {urlQuery && (
          <section className="px-3 pb-10 pt-5">
            <div className="mb-4 flex items-end justify-between px-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-black/40">
                  Search results
                </p>

                <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">
                  “{urlQuery}”
                </h2>
              </div>

              <p className="text-[11px] text-black/40">
                {searchResults.length}{" "}
                {searchResults.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-black/[0.06] bg-white px-5 py-10 text-center shadow-[0_3px_14px_rgba(0,0,0,0.025)]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#356a47]/[0.08]">
                  <Search
                    size={21}
                    strokeWidth={2}
                    className="text-[#356a47]"
                  />
                </div>

                <h3 className="mt-4 text-[15px] font-semibold">
                  No products found
                </h3>

                <p className="mx-auto mt-2 max-w-[270px] text-[12px] leading-5 text-black/45">
                  We couldn’t find any product matching
                  your search. Try another keyword.
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-5 rounded-[11px] bg-[#356a47] px-4 py-2.5 text-[12px] font-semibold text-white transition active:scale-[0.97]"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

/**
 * Loading UI shown while searchParams
 * is being resolved inside Suspense.
 */
function SearchPageFallback() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5]">
        <header className="border-b border-black/[0.06] bg-[#f7f8f5]">
          <div className="flex h-[58px] items-center px-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white"
            >
              <ArrowLeft
                size={19}
                strokeWidth={2}
              />
            </Link>

            <div className="ml-3">
              <div className="h-4 w-20 animate-pulse rounded bg-black/[0.08]" />
              <div className="mt-2 h-3 w-28 animate-pulse rounded bg-black/[0.05]" />
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="h-[48px] animate-pulse rounded-[15px] bg-black/[0.05]" />
          </div>
        </header>

        <section className="px-4 pt-8">
          <div className="h-5 w-48 animate-pulse rounded bg-black/[0.07]" />

          <div className="mt-2 h-3 w-64 animate-pulse rounded bg-black/[0.05]" />

          <div className="mt-6 flex gap-2">
            <div className="h-9 w-16 animate-pulse rounded-full bg-black/[0.05]" />
            <div className="h-9 w-14 animate-pulse rounded-full bg-black/[0.05]" />
            <div className="h-9 w-20 animate-pulse rounded-full bg-black/[0.05]" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}