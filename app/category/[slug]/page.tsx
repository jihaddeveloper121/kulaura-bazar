"use client";

import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products, type Product } from "@/lib/products";

const categoryMap: Record<
  string,
  {
    name: string;
    description: string;
  }
> = {
  grocery: {
    name: "Grocery",
    description: "Everyday groceries for your home",
  },

  beauty: {
    name: "Beauty",
    description: "Personal care and beauty essentials",
  },

  stationery: {
    name: "Stationery",
    description: "Useful stationery for study and work",
  },

  "dairy-bakery": {
    name: "Dairy & Bakery",
    description: "Fresh dairy and bakery essentials",
  },

  "soft-drinks": {
    name: "Soft Drinks",
    description: "Refreshing drinks for every occasion",
  },

  "home-essentials": {
    name: "Home Essentials",
    description: "Essential products for your home",
  },

  "baby-care": {
    name: "Baby Care",
    description: "Everyday essentials for your little ones",
  },

  other: {
    name: "Other",
    description: "More useful products from KULAURA BAZAR",
  },
};

export default function CategoryPage() {
  const params = useParams();

  const rawSlug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const slug = decodeURIComponent(rawSlug || "")
    .toLowerCase()
    .trim();

  const categoryInfo = categoryMap[slug];

  const categoryName =
    categoryInfo?.name ||
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const [sort, setSort] = useState("standard");

  const [selectedSection, setSelectedSection] =
    useState("all");

  const [selectedBrand, setSelectedBrand] =
    useState("all");

  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  const [temporarySection, setTemporarySection] =
    useState("all");

  const [temporaryBrand, setTemporaryBrand] =
    useState("all");

  /*
   * Category Products
   *
   * URL:
   * /category/grocery
   *
   * becomes:
   * grocery
   *
   * and matches:
   * product.category = "Grocery"
   */
  const categoryProducts = useMemo(() => {
    const targetCategory = slug
      .toLowerCase()
      .trim();

    return products.filter((product) => {
      const productCategory = product.category
        .toLowerCase()
        .trim();

      return productCategory === targetCategory;
    });
  }, [slug]);

  /*
   * Product Filter Options
   */
  const sections = useMemo(() => {
    return Array.from(
      new Set(
        categoryProducts
          .map((product) => product.section)
          .filter(Boolean)
      )
    );
  }, [categoryProducts]);

  /*
   * Brand Options
   */
  const brands = useMemo(() => {
    return Array.from(
      new Set(
        categoryProducts
          .map((product) => product.brand)
          .filter(
            (brand): brand is string =>
              Boolean(brand)
          )
      )
    );
  }, [categoryProducts]);

  /*
   * Filter + Sort
   */
  const filteredProducts = useMemo(() => {
    let result: Product[] = [
      ...categoryProducts,
    ];

    if (selectedSection !== "all") {
      result = result.filter(
        (product) =>
          product.section === selectedSection
      );
    }

    if (selectedBrand !== "all") {
      result = result.filter(
        (product) =>
          product.brand === selectedBrand
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [
    categoryProducts,
    selectedSection,
    selectedBrand,
    sort,
  ]);

  /*
   * Open Filter
   */
  const openFilter = () => {
    setTemporarySection(selectedSection);
    setTemporaryBrand(selectedBrand);
    setIsFilterOpen(true);
  };

  /*
   * Apply Filter
   */
  const applyFilter = () => {
    setSelectedSection(temporarySection);
    setSelectedBrand(temporaryBrand);
    setIsFilterOpen(false);
  };

  /*
   * Clear Filters
   */
  const clearFilters = () => {
    setSelectedSection("all");
    setSelectedBrand("all");
    setTemporarySection("all");
    setTemporaryBrand("all");
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5]">

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f7f8f5]/95 backdrop-blur">

          <div className="flex h-[58px] items-center px-4">

            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white"
            >
              <ArrowLeft
                size={18}
                strokeWidth={2}
              />
            </Link>

            <div className="ml-3 min-w-0">

              <h1 className="truncate text-[17px] font-bold">
                {categoryName}
              </h1>

              <p className="text-[10px] text-gray-500">
                {filteredProducts.length} products
              </p>

            </div>

          </div>

        </header>

        {/* Category Description */}
        <section className="px-4 pb-3 pt-5">

          <p className="text-[12px] leading-5 text-gray-500">
            {categoryInfo?.description ||
              `Explore products from ${categoryName}`}
          </p>

        </section>

        {/* Sort + Filter */}
        <section className="sticky top-[58px] z-20 border-y border-black/[0.05] bg-[#f7f8f5]/95 px-4 py-2.5 backdrop-blur">

          <div className="flex items-center gap-2">

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="h-9 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white px-2.5 text-[11px] font-medium text-[#17211b] outline-none"
            >

              <option value="standard">
                Standard
              </option>

              <option value="price-low">
                Price Low to High
              </option>

              <option value="price-high">
                Price High to Low
              </option>

            </select>

            <button
              type="button"
              onClick={openFilter}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3 text-[11px] font-medium"
            >

              <SlidersHorizontal size={14} />

              Filter

            </button>

          </div>

        </section>

        {/* Active Filters */}
        {(selectedSection !== "all" ||
          selectedBrand !== "all") && (

          <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 pt-3">

            {selectedSection !== "all" && (
              <span className="shrink-0 rounded-full bg-[#17211b] px-3 py-1.5 text-[10px] font-medium text-white">
                {selectedSection}
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="shrink-0 rounded-full bg-[#17211b] px-3 py-1.5 text-[10px] font-medium text-white">
                {selectedBrand}
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-[10px] font-medium text-gray-500 underline"
            >
              Clear
            </button>

          </div>
        )}

        {/* Product Grid */}
        <section className="px-3 pb-8 pt-3">

          {filteredProducts.length > 0 ? (

            <div className="grid grid-cols-2 gap-3">

              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>

          ) : (

            <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-14 text-center">

              <h2 className="text-[15px] font-semibold">
                No products found
              </h2>

              <p className="mt-1 text-[11px] leading-5 text-gray-500">
                There are no products available in
                this category yet.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex rounded-xl bg-[#17211b] px-4 py-2.5 text-[11px] font-semibold text-white"
              >
                Back to Home
              </Link>

            </div>

          )}

        </section>

        {/* Filter Bottom Sheet */}
        {isFilterOpen && (

          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">

            <div className="w-full max-w-[480px] rounded-t-3xl bg-white px-5 pb-7 pt-5">

              {/* Handle */}
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />

              {/* Filter Header */}
              <div className="flex items-center justify-between">

                <h2 className="text-[17px] font-bold">
                  Product Filter
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setIsFilterOpen(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                  aria-label="Close filter"
                >
                  <X size={16} />
                </button>

              </div>

              {/* Product Filter */}
              {sections.length > 0 && (

                <div className="mt-6">

                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                    Product Filter
                  </p>

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setTemporarySection("all")
                      }
                      className={`rounded-full border px-3 py-2 text-[11px] ${
                        temporarySection === "all"
                          ? "border-[#17211b] bg-[#17211b] text-white"
                          : "border-black/[0.08] bg-white text-[#17211b]"
                      }`}
                    >
                      All
                    </button>

                    {sections.map(
                      (section) => (

                        <button
                          key={section}
                          type="button"
                          onClick={() =>
                            setTemporarySection(
                              section
                            )
                          }
                          className={`rounded-full border px-3 py-2 text-[11px] ${
                            temporarySection ===
                            section
                              ? "border-[#17211b] bg-[#17211b] text-white"
                              : "border-black/[0.08] bg-white text-[#17211b]"
                          }`}
                        >
                          {section}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* Brand */}
              {brands.length > 0 && (

                <div className="mt-6">

                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                    Brand
                  </p>

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setTemporaryBrand("all")
                      }
                      className={`rounded-full border px-3 py-2 text-[11px] ${
                        temporaryBrand === "all"
                          ? "border-[#17211b] bg-[#17211b] text-white"
                          : "border-black/[0.08] bg-white text-[#17211b]"
                      }`}
                    >
                      All
                    </button>

                    {brands.map(
                      (brand) => (

                        <button
                          key={brand}
                          type="button"
                          onClick={() =>
                            setTemporaryBrand(
                              brand
                            )
                          }
                          className={`rounded-full border px-3 py-2 text-[11px] ${
                            temporaryBrand ===
                            brand
                              ? "border-[#17211b] bg-[#17211b] text-white"
                              : "border-black/[0.08] bg-white text-[#17211b]"
                          }`}
                        >
                          {brand}
                        </button>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* Apply Filter */}
              <button
                type="button"
                onClick={applyFilter}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-2xl bg-[#17211b] text-[12px] font-semibold text-white"
              >
                Apply Filter
              </button>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}