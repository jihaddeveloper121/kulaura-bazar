"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Product,
  getProductPrice,
  getProductOldPrice,
} from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentPrice = getProductPrice(product);
  const testProductType = product.productType;
  const oldPrice = getProductOldPrice(product);

  const discount =
    oldPrice && oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  useEffect(() => {
    const wishlist = localStorage.getItem("kulaura-bazar-wishlist");

    if (!wishlist) return;

    try {
      const ids: number[] = JSON.parse(wishlist);
      setIsWishlisted(ids.includes(product.id));
    } catch {
      setIsWishlisted(false);
    }
  }, [product.id]);

  const toggleWishlist = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const saved = localStorage.getItem("kulaura-bazar-wishlist");

    let ids: number[] = [];

    if (saved) {
      try {
        ids = JSON.parse(saved);
      } catch {
        ids = [];
      }
    }

    if (ids.includes(product.id)) {
      ids = ids.filter((id) => id !== product.id);
      setIsWishlisted(false);
    } else {
      ids.push(product.id);
      setIsWishlisted(true);
    }

    localStorage.setItem(
      "kulaura-bazar-wishlist",
      JSON.stringify(ids)
    );

    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const isOutOfStock =
    product.stock <= 0 || product.status === "archived";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block min-w-0"
    >
      <article className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all duration-200 active:scale-[0.99]">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
          {!imageError ? (
            <Image
              src={product.primaryImage || product.image}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 50vw, 240px"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-gray-400">
              Product image
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-[#e07a24] px-1.5 py-1 text-[10px] font-semibold text-white">
              -{discount}%
            </span>
          )}

          {/* Verified */}
          {product.verified && (
            <span
              className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm"
              title="Verified product"
            >
              <BadgeCheck
                size={16}
                strokeWidth={2.2}
                className="text-[#356a47]"
              />
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-transform active:scale-90"
          >
            <Heart
              size={17}
              strokeWidth={1.8}
              className={
                isWishlisted
                  ? "fill-[#e07a24] text-[#e07a24]"
                  : "text-[#30352f]"
              }
            />
          </button>

          {/* Out of Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="rounded-full bg-black/80 px-3 py-1.5 text-[11px] font-semibold text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="px-3 pb-3 pt-2.5">
          <div className="mb-1 flex items-center gap-1.5">
            {product.brand && (
              <span className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">
                {product.brand}
              </span>
            )}

            {product.productType && (
              <>
                {product.brand && (
                  <span className="text-[9px] text-gray-300">
                    /
                  </span>
                )}

                <span className="truncate text-[10px] text-gray-400">
                  {product.productType}
                </span>
              </>
            )}
          </div>

          <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-[18px] text-[#17211b]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-[15px] font-bold text-[#17211b]">
                  ৳{currentPrice}
                </span>

                {oldPrice && oldPrice > currentPrice && (
                  <span className="text-[10px] text-gray-400 line-through">
                    ৳{oldPrice}
                  </span>
                )}
              </div>

              <span className="mt-0.5 block text-[10px] text-gray-400">
                {product.unit === "kg"
                  ? "per kg"
                  : product.unit === "liter"
                    ? "per litre"
                    : product.unit === "gram"
                      ? "per pack"
                      : ""}
              </span>
            </div>

            {/* Cart Icon */}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-300"
                  : "bg-[#17211b] text-white"
              }`}
            >
              <ShoppingCart
                size={15}
                strokeWidth={2}
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}