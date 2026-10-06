"use client";

import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(urlQuery);

  useEffect(() => {
    setSearchText(urlQuery);
  }, [urlQuery]);

  /*
   * SEARCH RESULTS
   */
  const searchResults = useMemo(() => {
    const query = normalizeText(urlQuery);

    if (!query) {
      return [];
    }

    return products.filter((product) => {
      /*
       * Only explicitly archived products are hidden.
       * If status is undefined, the product is still searchable.
       */
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

  /*
   * SEARCH SUBMIT
   */
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      router.push("/search");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(value)}`
    );
  };

  /*
   * CLEAR SEARCH
   */
  const clearSearch = () => {
    setSearchText("");
    router.push("/search");
  };

  /*
   * POPULAR SEARCH
   */
  const searchProduct = (productName: string) => {
    setSearchText(productName);

    router.push(
      `/search?q=${encodeURIComponent(productName)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">

      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5] pb-8">

        {/* ================= HEADER ================= */}
        <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f8f5]/95 backdrop-blur">

          <div className="flex h-[58px] items-center px-4">

            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white"
            >
              <ArrowLeft
                size={18}
                strokeWidth={2}
              />
            </Link>

            <div className="ml-3">

              <h1 className="text-[17px] font-bold">
                Search
              </h1>

              <p className="text-[10px] text-gray-500">
                Find products quickly
              </p>

            </div>

          </div>

          {/* ================= SEARCH INPUT ================= */}
          <form
            onSubmit={handleSearch}
            className="px-4 pb-3"
          >

            <div className="flex h-[48px] items-center rounded-2xl border border-black/[0.08] bg-white px-3">

              <Search
                size={18}
                strokeWidth={1.8}
                className="shrink-0 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search products, brands and shops..."
                autoComplete="off"
                className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] text-[#17211b] outline-none placeholder:text-gray-400"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100"
                >
                  <X
                    size={14}
                    strokeWidth={2}
                  />
                </button>
              )}

            </div>

          </form>

        </header>

        {/* ================= NO QUERY ================= */}
        {!urlQuery && (
          <section className="px-4 pt-8">

            <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f3ef]">

                <Search
                  size={22}
                  strokeWidth={1.8}
                  className="text-[#356a47]"
                />

              </div>

              <h2 className="mt-4 text-[15px] font-semibold">
                Search Products
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-gray-500">
                Search by product name, brand, category or keyword.
              </p>

            </div>

            {/* POPULAR SEARCHES */}
            <div className="mt-6">

              <p className="px-1 text-[11px] font-semibold text-gray-500">
                Popular searches
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

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
                    className="rounded-full border border-black/[0.07] bg-white px-3.5 py-2 text-[10px] font-medium text-[#17211b] active:scale-[0.98]"
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

          </section>
        )}

        {/* ================= SEARCH RESULTS ================= */}
        {urlQuery && (
          <section className="px-3 pb-10 pt-5">

            <div className="px-1 pb-4">

              <h2 className="text-[15px] font-semibold">
                Search results
              </h2>

              <p className="mt-1 text-[10px] text-gray-500">
                {searchResults.length}{" "}
                {searchResults.length === 1
                  ? "product"
                  : "products"}{" "}
                found for "{urlQuery}"
              </p>

            </div>

            {/* RESULTS */}
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

              /* NO RESULTS */
              <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-14 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f3ef]">

                  <Search
                    size={21}
                    strokeWidth={1.8}
                    className="text-gray-400"
                  />

                </div>

                <h2 className="mt-4 text-[15px] font-semibold">
                  No products found
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  We could not find any product matching "{urlQuery}".
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-5 rounded-xl bg-[#17211b] px-5 py-2.5 text-[11px] font-semibold text-white"
                >
                  Search again
                </button>

              </div>

            )}

          </section>
        )}

      </div>

    </main>
  );
}