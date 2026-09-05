"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
  Check,
} from "lucide-react";

import {
  products,
  formatQuantity,
  getProductPrice,
  type Product,
} from "@/lib/products";

import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  type CartItem,
} from "@/lib/cart";


/* =========================================================
   TYPES
========================================================= */

type CartProduct = {
  product: Product;
  quantity: number;
};


/* =========================================================
   PAGE
========================================================= */

export default function CartPage() {

  const [cartItems, setCartItems] =
    useState<CartProduct[]>([]);

  const [loaded, setLoaded] =
    useState(false);


  /* =======================================================
     LOAD CART
  ======================================================= */

  const loadCart = () => {

    const cart = getCart();

    const items: CartProduct[] = cart
      .map((item: CartItem) => {

        const product = products.find(
          (product) =>
            product.id === item.productId
        );

        if (!product) {
          return null;
        }

        return {
          product,
          quantity: item.quantity,
        };
      })
      .filter(
        (item): item is CartProduct =>
          item !== null
      );

    setCartItems(items);

    setLoaded(true);
  };


  /* =======================================================
     CART UPDATE LISTENER
  ======================================================= */

  useEffect(() => {

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    return () => {

      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );

    };

  }, []);


  /* =======================================================
     CHECK FIXED PACK PRODUCT
  ======================================================= */

  const hasQuantityOptions = (
    product: Product
  ) => {

    return Boolean(
      product.quantityOptions &&
      product.quantityOptions.length > 0
    );

  };


  /* =======================================================
     DECREASE NORMAL PRODUCT
  ======================================================= */

  const decreaseQuantity = (
    product: Product,
    quantity: number
  ) => {

    /*
     * Milk Powder / Tea use fixed pack sizes.
     * They should not use + / - here.
     */
    if (
      hasQuantityOptions(product)
    ) {
      return;
    }


    const newQuantity =
      quantity - product.step;


    if (
      newQuantity <
      product.minQuantity
    ) {
      return;
    }


    updateCartItem(
      product.id,
      newQuantity
    );

    loadCart();
  };


  /* =======================================================
     INCREASE NORMAL PRODUCT
  ======================================================= */

  const increaseQuantity = (
    product: Product,
    quantity: number
  ) => {

    /*
     * Fixed pack products cannot
     * be increased with + button.
     */
    if (
      hasQuantityOptions(product)
    ) {
      return;
    }


    const newQuantity =
      quantity + product.step;


    if (
      newQuantity >
      product.maxQuantity
    ) {
      return;
    }


    updateCartItem(
      product.id,
      newQuantity
    );

    loadCart();
  };


  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (
    productId: number
  ) => {

    removeFromCart(productId);

    loadCart();
  };


  /* =======================================================
     CLEAR CART
  ======================================================= */

  const handleClearCart = () => {

    clearCart();

    loadCart();
  };


  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal =
    cartItems.reduce(
      (total, item) => {

        const price =
          getProductPrice(
            item.product,
            item.quantity
          );

        return total + price;

      },
      0
    );


  /* =======================================================
     PENDING PRICE
  ======================================================= */

  /*
   * এখন সব products-এর price আছে।
   * তাই pending price আর ব্যবহার করছি না।
   */
  const hasPendingPrice = false;


  /* =======================================================
     LOADING
  ======================================================= */

  if (!loaded) {

    return (
      <main className="min-h-screen bg-[#f8f6f1]">

        <div className="mx-auto max-w-[480px] px-4 pt-10 text-center">

          <p className="text-sm text-[#777]">
            Loading cart...
          </p>

        </div>

      </main>
    );
  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <main className="min-h-screen bg-[#f8f6f1] text-[#222]">

      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f8f6f1] pb-8">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex h-[64px] items-center justify-between px-4">

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Back to home"
          >

            <ArrowLeft
              size={22}
              strokeWidth={1.8}
            />

          </Link>


          <h1 className="text-[15px] font-bold">
            My Cart
          </h1>


          {cartItems.length > 0 ? (

            <button
              type="button"
              onClick={
                handleClearCart
              }
              className="text-[10px] font-semibold text-[#e47b32]"
            >
              Clear
            </button>

          ) : (

            <div className="w-10" />

          )}

        </header>


        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cartItems.length === 0 ? (

          <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">

              <ShoppingCart
                size={32}
                className="text-[#8a8a8a]"
                strokeWidth={1.5}
              />

            </div>


            <h2 className="mt-5 text-[17px] font-bold">
              Your cart is empty
            </h2>


            <p className="mt-2 max-w-[260px] text-[11px] leading-5 text-[#888]">
              Add some products from Kulaura Bazar
              to continue shopping.
            </p>


            <Link
              href="/"
              className="mt-6 rounded-xl bg-[#6f8f52] px-6 py-3 text-[12px] font-bold text-white"
            >
              Continue Shopping
            </Link>

          </section>

        ) : (

          <>


            {/* =================================================
                CART ITEMS
            ================================================= */}

            <section className="px-4">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-[11px] text-[#888]">

                  {cartItems.length}{" "}

                  {cartItems.length === 1
                    ? "product"
                    : "products"}

                </p>

              </div>


              <div className="space-y-3">

                {cartItems.map(
                  ({
                    product,
                    quantity,
                  }) => {

                    const itemPrice =
                      getProductPrice(
                        product,
                        quantity
                      );


                    const fixedPack =
                      hasQuantityOptions(
                        product
                      );


                    return (

                      <div
                        key={product.id}
                        className="rounded-2xl bg-white p-3"
                      >


                        <div className="flex gap-3">


                          {/* =================================
                              IMAGE
                          ================================= */}

                          <Link
                            href={`/products/${product.id}`}
                            className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-[#f7f5f0]"
                          >

                            <Image
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                              fill
                              className="object-contain p-2"
                              sizes="92px"
                            />

                          </Link>


                          {/* =================================
                              INFO
                          ================================= */}

                          <div className="min-w-0 flex-1">


                            {/* PRODUCT NAME + REMOVE */}

                            <div className="flex items-start justify-between gap-2">

                              <Link
                                href={`/products/${product.id}`}
                                className="min-w-0"
                              >

                                <p className="line-clamp-2 text-[12px] font-semibold leading-5">

                                  {product.name}

                                </p>

                              </Link>


                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    product.id
                                  )
                                }
                                className="flex h-7 w-7 shrink-0 items-center justify-center text-[#999]"
                                aria-label={`Remove ${product.name}`}
                              >

                                <Trash2
                                  size={15}
                                  strokeWidth={1.7}
                                />

                              </button>

                            </div>


                            {/* =================================
                                BRAND
                            ================================= */}

                            {product.brand && (

                              <p className="mt-0.5 text-[10px] text-[#999]">

                                {product.brand}

                              </p>

                            )}


                            {/* =================================
                                PRICE INFO
                            ================================= */}

                            <p className="mt-1 text-[10px] text-[#999]">

                              {fixedPack
                                ? `Selected: ${formatQuantity(
                                    quantity,
                                    product.unit
                                  )}`
                                : product.unit ===
                                    "kg"
                                  ? `৳${product.price} / kg`
                                  : product.unit ===
                                      "liter"
                                    ? `৳${product.price} / liter`
                                    : product.unit ===
                                        "packet"
                                      ? `৳${product.price} / packet`
                                      : `৳${product.price} / ${product.unit}`}

                            </p>


                            {/* =================================
                                QUANTITY + PRICE
                            ================================= */}

                            <div className="mt-3 flex items-center justify-between">


                              {/* FIXED PACK PRODUCT */}

                              {fixedPack ? (

                                <Link
                                  href={`/products/${product.id}`}
                                  className="flex items-center gap-2 rounded-lg border border-[#356a47]/20 bg-[#f4f7f0] px-3 py-2"
                                >

                                  <Check
                                    size={13}
                                    className="text-[#356a47]"
                                  />

                                  <span className="text-[10px] font-semibold text-[#356a47]">

                                    {formatQuantity(
                                      quantity,
                                      product.unit
                                    )}

                                  </span>

                                  <span className="text-[9px] text-[#888]">
                                    Change
                                  </span>

                                </Link>

                              ) : (

                                /* NORMAL PRODUCT */

                                <div className="flex items-center rounded-lg border border-black/10">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      decreaseQuantity(
                                        product,
                                        quantity
                                      )
                                    }
                                    disabled={
                                      quantity <=
                                      product.minQuantity
                                    }
                                    className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                                    aria-label="Decrease quantity"
                                  >

                                    <Minus
                                      size={13}
                                      strokeWidth={1.8}
                                    />

                                  </button>


                                  <span className="min-w-[58px] text-center text-[10px] font-semibold">

                                    {formatQuantity(
                                      quantity,
                                      product.unit
                                    )}

                                  </span>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      increaseQuantity(
                                        product,
                                        quantity
                                      )
                                    }
                                    disabled={
                                      quantity >=
                                      product.maxQuantity
                                    }
                                    className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                                    aria-label="Increase quantity"
                                  >

                                    <Plus
                                      size={13}
                                      strokeWidth={1.8}
                                    />

                                  </button>

                                </div>

                              )}


                              {/* ITEM PRICE */}

                              <div className="text-right">

                                <p className="text-[13px] font-bold">

                                  ৳{itemPrice}

                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            </section>


            {/* =================================================
                DELIVERY
            ================================================= */}

            <section className="mt-4 px-4">

              <div className="flex items-center gap-3 rounded-2xl bg-white p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3e8]">

                  <Truck
                    size={19}
                    className="text-[#55743b]"
                    strokeWidth={1.7}
                  />

                </div>


                <div>

                  <p className="text-[11px] font-bold">
                    Kulaura Local Delivery
                  </p>


                  <p className="mt-0.5 text-[10px] text-[#888]">
                    Delivery charge will be calculated
                    at checkout.
                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <section className="mt-4 px-4">

              <div className="rounded-2xl bg-white p-4">


                <h2 className="text-[13px] font-bold">
                  Order Summary
                </h2>


                <div className="mt-4 space-y-3">


                  {/* SUBTOTAL */}

                  <div className="flex items-center justify-between">

                    <span className="text-[11px] text-[#777]">
                      Subtotal
                    </span>


                    <span className="text-[12px] font-semibold">
                      ৳{subtotal}
                    </span>

                  </div>


                  {/* DELIVERY */}

                  <div className="flex items-center justify-between">

                    <span className="text-[11px] text-[#777]">
                      Delivery
                    </span>


                    <span className="text-[11px] text-[#999]">
                      At checkout
                    </span>

                  </div>


                  {/* TOTAL */}

                  <div className="border-t border-black/5 pt-3">

                    <div className="flex items-center justify-between">

                      <span className="text-[13px] font-bold">
                        Total
                      </span>


                      <span className="text-[16px] font-bold">
                        ৳{subtotal}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    PENDING PRICE MESSAGE
                ================================================= */}

                {hasPendingPrice && (

                  <div className="mt-4 rounded-xl bg-[#fff6ed] p-3">

                    <p className="text-[10px] leading-4 text-[#a56732]">
                      One or more products do not have a
                      confirmed price yet. The final amount
                      will be confirmed before checkout.
                    </p>

                  </div>

                )}


                {/* =================================================
                    CHECKOUT
                ================================================= */}

                {hasPendingPrice ? (

                  <button
                    type="button"
                    disabled
                    className="mt-4 h-[50px] w-full rounded-2xl bg-[#b8b8b8] text-[13px] font-bold text-white"
                  >
                    Price Confirmation Required
                  </button>

                ) : (

                  <Link
                    href="/checkout"
                    className="mt-4 flex h-[50px] w-full items-center justify-center rounded-2xl bg-[#6f8f52] text-[13px] font-bold text-white transition active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </Link>

                )}

              </div>

            </section>

          </>

        )}

      </div>

    </main>
  );
}