"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useParams } from "next/navigation";

import {
  getProductById,
  formatQuantity,
  getProductPrice,
  getProductOldPrice,
  products,
  type Product,
} from "@/lib/products";

import {
  addToCart as addProductToCart,
  getCartCount,
} from "@/lib/cart";


/* =========================================================
   TYPES
========================================================= */

type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

type ProductExtra = {
  brand?: string;
  quality?: string;
  color?: string;
  returnable?: boolean;
  returnNote?: string;
  images?: string[];

  quantityOptions?: number[];
  quantityPrices?: Record<number, number>;
  quantityOldPrices?: Record<number, number>;
};


/* =========================================================
   DEMO REVIEWS
========================================================= */

const demoReviews: Review[] = [
  {
    id: 1,
    name: "Rahim",
    rating: 5,
    date: "2 days ago",
    comment:
      "পণ্য ভালো ছিল এবং delivery-ও সময়মতো পেয়েছি।",
  },
  {
    id: 2,
    name: "Sadia",
    rating: 5,
    date: "5 days ago",
    comment:
      "Quality ভালো। আবার order করব।",
  },
  {
    id: 3,
    name: "Tanvir",
    rating: 4,
    date: "1 week ago",
    comment:
      "পণ্য ভালো ছিল এবং packaging সুন্দর ছিল।",
  },
  {
    id: 4,
    name: "Nusrat",
    rating: 5,
    date: "1 week ago",
    comment:
      "Kulaura Bazar থেকে shopping করা সহজ হয়েছে।",
  },
  {
    id: 5,
    name: "Arif",
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Price reasonable এবং product fresh ছিল।",
  },
];


/* =========================================================
   HELPERS
========================================================= */

function getDefaultQuantity(
  product: Product
): number {

  /*
   * Fixed pack-size product:
   * Prefer 500g if available.
   *
   * Milk Powder -> 500g
   * Tea -> 500g
   */
  if (product.quantityOptions?.length) {
    if (
      product.quantityOptions.includes(500)
    ) {
      return 500;
    }

    return product.quantityOptions[0];
  }


  /*
   * KG products:
   * Start from 1kg.
   */
  if (product.unit === "kg") {
    return Math.max(
      product.minQuantity,
      1000
    );
  }


  /*
   * Packet / liter / piece etc.
   */
  return product.minQuantity;
}


function getQuantityLabel(
  product: Product,
  quantity: number
): string {

  if (
    product.quantityOptions?.length
  ) {
    return formatQuantity(
      quantity,
      product.unit
    );
  }

  return formatQuantity(
    quantity,
    product.unit
  );
}


function getRelatedProductPrice(
  product: Product
): number {

  /*
   * For products with fixed pack sizes,
   * show the default 500g price when available.
   */
  if (
    product.quantityOptions?.length &&
    product.quantityPrices
  ) {
    if (
      product.quantityPrices[500] !==
      undefined
    ) {
      return product.quantityPrices[500];
    }

    const firstQuantity =
      product.quantityOptions[0];

    return (
      product.quantityPrices[
        firstQuantity
      ] ?? product.price
    );
  }

  return product.price;
}


/* =========================================================
   PAGE
========================================================= */

export default function ProductDetailsPage() {

  const params = useParams();

  const productId = Number(
    params.id
  );

  const product =
    getProductById(productId);


  /* =======================================================
     STATES
  ======================================================= */

  const [quantity, setQuantity] =
    useState<number>(
      product
        ? getDefaultQuantity(product)
        : 1
    );

  const [selectedImage, setSelectedImage] =
    useState<string>(
      product?.image ?? ""
    );

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [cartCount, setCartCount] =
    useState(0);

  const [addedToCart, setAddedToCart] =
    useState(false);


  /* =======================================================
     RESET WHEN PRODUCT CHANGES
  ======================================================= */

  useEffect(() => {

    if (!product) {
      return;
    }

    setQuantity(
      getDefaultQuantity(product)
    );

    setSelectedImage(
      product.image
    );

    setAddedToCart(false);

  }, [productId]);


  /* =======================================================
     CART COUNT
  ======================================================= */

  useEffect(() => {

    setCartCount(
      getCartCount()
    );

  }, [addedToCart]);


  /* =======================================================
     PRODUCT NOT FOUND
  ======================================================= */

  if (!product) {

    return (
      <main className="min-h-screen bg-[#f8f6f1] px-5 py-10">

        <div className="mx-auto max-w-[480px]">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#356a47]"
          >
            <ArrowLeft size={18} />

            Back to Home
          </Link>


          <div className="mt-16 text-center">

            <h1 className="text-xl font-semibold text-[#17211b]">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              এই product-টি বর্তমানে পাওয়া যাচ্ছে না।
            </p>

          </div>

        </div>

      </main>
    );
  }


  /* =======================================================
     PRODUCT EXTRA DATA
  ======================================================= */

  const productExtra =
    product as Product & ProductExtra;


  const hasQuantityOptions =
    Boolean(
      productExtra.quantityOptions &&
      productExtra.quantityOptions.length
    );


  /* =======================================================
     PRICE
  ======================================================= */

  const currentPrice =
    getProductPrice(
      product,
      quantity
    );


  const currentOldPrice =
    getProductOldPrice(
      product,
      quantity
    );


  const totalPrice =
    currentPrice;


  const hasDiscount =
    currentOldPrice !== null &&
    currentOldPrice > currentPrice;


  /* =======================================================
     IMAGES
  ======================================================= */

  const productImages =
    product.images &&
    product.images.length > 0
      ? product.images
      : [product.image];


  /* =======================================================
     QUANTITY
  ======================================================= */

  const increaseQuantity = () => {

    if (hasQuantityOptions) {
      return;
    }

    const nextQuantity =
      quantity + product.step;

    if (
      nextQuantity <=
      product.maxQuantity
    ) {
      setQuantity(nextQuantity);
    }
  };


  const decreaseQuantity = () => {

    if (hasQuantityOptions) {
      return;
    }

    const nextQuantity =
      quantity - product.step;

    if (
      nextQuantity >=
      product.minQuantity
    ) {
      setQuantity(nextQuantity);
    }
  };


  const handleManualQuantityChange = (
    value: string
  ) => {

    if (hasQuantityOptions) {
      return;
    }

    const numericValue =
      Number(value);

    if (
      Number.isNaN(numericValue)
    ) {
      return;
    }

    const safeValue = Math.min(
      Math.max(
        numericValue,
        product.minQuantity
      ),
      product.maxQuantity
    );

    setQuantity(safeValue);
  };


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = () => {

    addProductToCart(
      product.id,
      quantity
    );

    setCartCount(
      getCartCount()
    );

    setAddedToCart(true);


    setTimeout(() => {
      setAddedToCart(false);
    }, 1800);
  };


  /* =======================================================
     RELATED PRODUCTS
  ======================================================= */

  const relatedProducts =
    products
      .filter(
        (item) =>
          item.category ===
            product.category &&
          item.id !== product.id
      )
      .slice(0, 4);


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f8f6f1]">

      <div className="mx-auto min-h-screen max-w-[480px] bg-[#f8f6f1]">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-[62px] items-center justify-between border-b border-black/5 bg-[#f8f6f1]/95 px-4 backdrop-blur">

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#17211b]"
            aria-label="Back"
          >
            <ArrowLeft size={21} />
          </Link>


          <h1 className="text-[15px] font-semibold text-[#17211b]">
            Product Details
          </h1>


          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#17211b]"
            aria-label="Cart"
          >

            <ShoppingCart size={21} />


            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e07a24] px-1 text-[10px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </Link>

        </header>


        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <section className="px-4 pt-4">

          <div className="relative overflow-hidden rounded-[22px] bg-white">

            <div className="relative flex h-[340px] items-center justify-center">

              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-6"
                sizes="480px"
              />


              {/* Wishlist */}

              <button
                type="button"
                onClick={() =>
                  setIsWishlisted(
                    !isWishlisted
                  )
                }
                className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 shadow-sm ${
                  isWishlisted
                    ? "border-[#e07a24] text-[#e07a24]"
                    : "border-black/5 text-[#17211b]"
                }`}
                aria-label="Wishlist"
              >

                <Heart
                  size={19}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />

              </button>

            </div>

          </div>


          {/* =================================================
              IMAGE THUMBNAILS
          ================================================= */}

          {productImages.length > 1 && (

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

              {productImages.map(
                (image, index) => (

                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                    className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border bg-white ${
                      selectedImage === image
                        ? "border-[#356a47]"
                        : "border-black/5"
                    }`}
                  >

                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="68px"
                    />

                  </button>

                )
              )}

            </div>
          )}

        </section>


        {/* =================================================
            PRODUCT BASIC INFORMATION
        ================================================= */}

        <section className="px-4 pt-5">

          {/* Category */}

          <p className="text-xs font-medium text-[#356a47]">
            {product.category}
          </p>


          {/* Product Name */}

          <h2 className="mt-1 text-[23px] font-semibold leading-tight text-[#17211b]">
            {product.name}
          </h2>


          {/* Rating */}

          <div className="mt-3 flex items-center gap-2">

            <div className="flex items-center gap-0.5 text-[#e07a24]">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}
                    size={15}
                    fill="currentColor"
                  />

                )
              )}

            </div>


            <span className="text-xs text-gray-500">
              4.8 · {demoReviews.length} reviews
            </span>

          </div>

        </section>


        {/* =================================================
            QUANTITY / PACK SIZE
        ================================================= */}

        <section className="mt-5 border-y border-black/5 bg-white px-4 py-5">

          {hasQuantityOptions ? (

            <>
              {/* Fixed Pack Size */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-[#17211b]">
                    Select Pack Size
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    আপনার প্রয়োজন অনুযায়ী একটি size নির্বাচন করুন
                  </p>

                </div>


                <span className="text-xs font-medium text-[#356a47]">
                  {getQuantityLabel(
                    product,
                    quantity
                  )}
                </span>

              </div>


              {/* Pack Buttons */}

              <div className="mt-4 grid grid-cols-3 gap-2">

                {productExtra.quantityOptions?.map(
                  (option) => {

                    const isSelected =
                      quantity === option;


                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setQuantity(
                            option
                          )
                        }
                        className={`relative rounded-xl border px-3 py-3 text-center transition ${
                          isSelected
                            ? "border-[#356a47] bg-[#356a47] text-white"
                            : "border-black/10 bg-[#fafaf8] text-[#17211b]"
                        }`}
                      >

                        {isSelected && (
                          <Check
                            size={13}
                            className="absolute right-2 top-2"
                          />
                        )}

                        <span className="block text-sm font-semibold">
                          {formatQuantity(
                            option,
                            product.unit
                          )}
                        </span>


                        <span
                          className={`mt-1 block text-[11px] ${
                            isSelected
                              ? "text-white/80"
                              : "text-gray-500"
                          }`}
                        >
                          ৳
                          {getProductPrice(
                            product,
                            option
                          )}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </>

          ) : (

            <>
              {/* Normal Quantity */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-[#17211b]">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Minimum {formatQuantity(
                      product.minQuantity,
                      product.unit
                    )}
                  </p>

                </div>


                <div className="flex items-center rounded-xl border border-black/10 bg-[#fafaf8]">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <=
                      product.minQuantity
                    }
                    className="flex h-11 w-11 items-center justify-center text-[#17211b] disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={17} />
                  </button>


                  <input
                    type="number"
                    value={quantity}
                    min={product.minQuantity}
                    max={product.maxQuantity}
                    onChange={(event) =>
                      handleManualQuantityChange(
                        event.target.value
                      )
                    }
                    className="h-11 w-[65px] border-x border-black/10 bg-transparent text-center text-sm font-semibold text-[#17211b] outline-none"
                  />


                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      product.maxQuantity
                    }
                    className="flex h-11 w-11 items-center justify-center text-[#17211b] disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>


              <div className="mt-3 text-right text-xs text-gray-500">
                {formatQuantity(
                  quantity,
                  product.unit
                )}
              </div>

            </>
          )}

        </section>


        {/* =================================================
            PRICE
        ================================================= */}

        <section className="px-4 pt-5">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs text-gray-500">
                {hasQuantityOptions
                  ? "Selected pack price"
                  : "Price"}
              </p>


              <div className="mt-1 flex items-baseline gap-2">

                <span className="text-[28px] font-bold text-[#17211b]">
                  ৳{totalPrice}
                </span>


                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{currentOldPrice}
                  </span>
                )}

              </div>

            </div>


            <div className="text-right">

              <p className="text-xs text-gray-500">
                {hasQuantityOptions
                  ? getQuantityLabel(
                      product,
                      quantity
                    )
                  : product.unit ===
                    "kg"
                  ? "per kg"
                  : product.unit ===
                    "liter"
                  ? "per liter"
                  : product.unit ===
                    "packet"
                  ? "per packet"
                  : ""}
              </p>

            </div>

          </div>


          {/* Discount */}

          {hasDiscount && (
            <div className="mt-2 inline-flex rounded-full bg-[#e07a24]/10 px-3 py-1 text-xs font-semibold text-[#e07a24]">
              {product.discount}
            </div>
          )}

        </section>


        {/* =================================================
            ADD TO CART
        ================================================= */}

        <section className="px-4 pt-5">

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-sm transition ${
              addedToCart
                ? "bg-[#356a47]"
                : "bg-[#17211b]"
            }`}
          >

            {addedToCart ? (
              <>
                <Check size={19} />

                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={19} />

                Add to Cart
              </>
            )}

          </button>

        </section>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <section className="mt-7 px-4">

          <h3 className="text-[17px] font-semibold text-[#17211b]">
            Description
          </h3>


          <p className="mt-3 text-[14px] leading-7 text-gray-600">
            {product.description}
          </p>

        </section>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <section className="mt-7 px-4">

          <h3 className="text-[17px] font-semibold text-[#17211b]">
            Product Information
          </h3>


          <div className="mt-3 overflow-hidden rounded-2xl border border-black/5 bg-white">

            {productExtra.brand && (
              <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">

                <span className="text-sm text-gray-500">
                  Brand
                </span>

                <span className="text-sm font-medium text-[#17211b]">
                  {productExtra.brand}
                </span>

              </div>
            )}


            {productExtra.quality && (
              <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">

                <span className="text-sm text-gray-500">
                  Quality
                </span>

                <span className="text-sm font-medium text-[#17211b]">
                  {productExtra.quality}
                </span>

              </div>
            )}


            {productExtra.color && (
              <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">

                <span className="text-sm text-gray-500">
                  Color
                </span>

                <span className="text-sm font-medium text-[#17211b]">
                  {productExtra.color}
                </span>

              </div>
            )}


            <div className="flex items-center justify-between px-4 py-3">

              <span className="text-sm text-gray-500">
                {hasQuantityOptions
                  ? "Selected Size"
                  : "Unit"}
              </span>

              <span className="text-sm font-medium text-[#17211b]">
                {hasQuantityOptions
                  ? getQuantityLabel(
                      product,
                      quantity
                    )
                  : product.unit}
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            SERVICE INFORMATION
        ================================================= */}

        <section className="mt-7 px-4">

          <div className="space-y-2">

            {/* Delivery */}

            <div className="flex items-start gap-3 rounded-2xl bg-white p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#356a47]/10 text-[#356a47]">

                <Truck size={19} />

              </div>


              <div>

                <p className="text-sm font-semibold text-[#17211b]">
                  Local Delivery
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Kulaura area-তে local delivery service available।
                </p>

              </div>

            </div>


            {/* Return */}

            <div className="flex items-start gap-3 rounded-2xl bg-white p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#356a47]/10 text-[#356a47]">

                <RotateCcw size={19} />

              </div>


              <div>

                <p className="text-sm font-semibold text-[#17211b]">
                  Return Policy
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {productExtra.returnNote ??
                    "Product return policy applies according to shop terms."}
                </p>

              </div>

            </div>


            {/* Quality */}

            <div className="flex items-start gap-3 rounded-2xl bg-white p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#356a47]/10 text-[#356a47]">

                <ShieldCheck size={19} />

              </div>


              <div>

                <p className="text-sm font-semibold text-[#17211b]">
                  Quality Checked
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Product information is provided based on the selected item.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            CUSTOMER REVIEWS
        ================================================= */}

        <section className="mt-8 px-4">

          <div className="flex items-center justify-between">

            <h3 className="text-[17px] font-semibold text-[#17211b]">
              Customer Reviews
            </h3>


            <span className="text-xs font-medium text-[#356a47]">
              4.8 / 5
            </span>

          </div>


          <div className="mt-4 space-y-3">

            {demoReviews.map(
              (review) => (

                <div
                  key={review.id}
                  className="rounded-2xl bg-white p-4"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-semibold text-[#17211b]">
                        {review.name}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {review.date}
                      </p>

                    </div>


                    <div className="flex items-center gap-0.5 text-[#e07a24]">

                      {Array.from({
                        length: review.rating,
                      }).map(
                        (_, index) => (

                          <Star
                            key={index}
                            size={13}
                            fill="currentColor"
                          />

                        )
                      )}

                    </div>

                  </div>


                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {review.comment}
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* =================================================
            RELATED PRODUCTS
        ================================================= */}

        {relatedProducts.length > 0 && (

          <section className="mt-8 px-4 pb-10">

            <div className="flex items-center justify-between">

              <h3 className="text-[17px] font-semibold text-[#17211b]">
                Related Products
              </h3>


              <Link
                href="/products"
                className="text-xs font-semibold text-[#356a47]"
              >
                See all
              </Link>

            </div>


            <div className="mt-4 grid grid-cols-2 gap-3">

              {relatedProducts.map(
                (relatedProduct) => (

                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="overflow-hidden rounded-2xl bg-white"
                  >

                    <div className="relative h-[150px] bg-[#fafaf8]">

                      <Image
                        src={
                          relatedProduct.image
                        }
                        alt={
                          relatedProduct.name
                        }
                        fill
                        className="object-contain p-4"
                        sizes="220px"
                      />

                    </div>


                    <div className="p-3">

                      <p className="line-clamp-2 text-sm font-medium leading-5 text-[#17211b]">
                        {relatedProduct.name}
                      </p>


                      <div className="mt-2 flex items-center justify-between">

                        <span className="text-sm font-bold text-[#17211b]">
                          ৳
                          {getRelatedProductPrice(
                            relatedProduct
                          )}
                        </span>


                        <span className="text-[10px] text-gray-400">
                          {relatedProduct.quantityOptions?.length
                            ? "from"
                            : relatedProduct.unit}
                        </span>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          </section>
        )}

      </div>

    </main>
  );
}