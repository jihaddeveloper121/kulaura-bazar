"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  HandCoins,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

import {
  products,
  getProductPrice,
  formatQuantity,
} from "@/lib/products";

import { getCart, clearCart, type CartItem } from "@/lib/cart";

type CheckoutItem = {
  product: (typeof products)[number];
  quantity: number;
};

type DeliveryMethod = "premium" | "average";
type PaymentMethod = "cod" | "bkash" | "qr";

type SavedOrder = {
  id: string;
  createdAt: string;
  estimatedDelivery: string;

  customer: {
    fullName: string;
    phone: string;
    area: string;
    address: string;
    landmark: string;
  };

  items: {
    productId: number;
    name: string;
    quantity: number;
    unit: string;
    price: number;
  }[];

  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  total: number;
};

const ORANGE = "#E47B32";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Chowdhury Bazar");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("premium");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [error, setError] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  /* ================================================= */
  /* LOAD CART */
  /* ================================================= */

  useEffect(() => {
    const cart = getCart();

    const items: CheckoutItem[] = cart
      .map((item: CartItem) => {
        const product = products.find(
          (product) => product.id === item.productId
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
        (item): item is CheckoutItem =>
          item !== null
      );

    setCartItems(items);
    setLoaded(true);
  }, []);

  /* ================================================= */
  /* TOTALS */
  /* ================================================= */

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = getProductPrice(
        item.product,
        item.quantity
      );

      return total + price;
    }, 0);
  }, [cartItems]);

  const productCount = cartItems.length;

  const premiumEligible =
    productCount >= 5 &&
    subtotal >= 999;

  const amountRemaining = Math.max(
    999 - subtotal,
    0
  );

  const progressPercent = Math.min(
    (subtotal / 999) * 100,
    100
  );

  const premiumCharge =
    premiumEligible ? 0 : 30;

  const deliveryCharge =
    deliveryMethod === "premium"
      ? premiumCharge
      : 0;

  const total =
    subtotal + deliveryCharge;

  /* ================================================= */
  /* PREMIUM AUTO SELECT */
  /* ================================================= */

  useEffect(() => {
    if (premiumEligible) {
      setDeliveryMethod("premium");
    }
  }, [premiumEligible]);

  /* ================================================= */
  /* VALIDATION */
  /* ================================================= */

  const validateInformation = () => {
    if (!fullName.trim()) {
      setError("আপনার নাম লিখুন।");
      return false;
    }

    if (!phone.trim()) {
      setError("আপনার ফোন নম্বর লিখুন।");
      return false;
    }

    if (!/^01\d{9}$/.test(phone.trim())) {
      setError(
        "সঠিক ১১ সংখ্যার ফোন নম্বর দিন।"
      );
      return false;
    }

    if (!area.trim()) {
      setError(
        "আপনার Area / Location লিখুন।"
      );
      return false;
    }

    if (!address.trim()) {
      setError(
        "আপনার সম্পূর্ণ Address লিখুন।"
      );
      return false;
    }

    setError("");
    return true;
  };

  const goToDelivery = () => {
    if (validateInformation()) {
      setStep(2);
    }
  };

  const goToPayment = () => {
    setError("");
    setStep(3);
  };

  const goToConfirm = () => {
    setError("");
    setStep(4);
  };

  /* ================================================= */
  /* PLACE ORDER */
  /* ================================================= */

  const placeOrder = () => {
    if (placingOrder || orderPlaced) {
      return;
    }

    if (cartItems.length === 0) {
      setError(
        "আপনার cart-এ কোনো product নেই।"
      );
      return;
    }

    setPlacingOrder(true);
    setError("");

    const now = new Date();

    const deliveryTime = new Date(now);

    if (deliveryMethod === "premium") {
      deliveryTime.setMinutes(
        deliveryTime.getMinutes() + 30
      );
    } else {
      deliveryTime.setHours(
        deliveryTime.getHours() + 8
      );
    }

    const generatedOrderId =
      `KB-${Date.now()
        .toString()
        .slice(-8)}`;

    const savedOrder: SavedOrder = {
      id: generatedOrderId,

      createdAt: now.toISOString(),

      estimatedDelivery:
        deliveryTime.toISOString(),

      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        area: area.trim(),
        address: address.trim(),
        landmark: landmark.trim(),
      },

      items: cartItems.map(
        ({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          quantity,
          unit: product.unit,
          price: getProductPrice(
            product,
            quantity
          ),
        })
      ),

      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryCharge,
      total,
    };

    /* SAVE ORDER HISTORY */

    try {
      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "kulaura-bazar-orders"
          ) || "[]"
        );

      const updatedOrders = [
        savedOrder,
        ...existingOrders,
      ];

      localStorage.setItem(
        "kulaura-bazar-orders",
        JSON.stringify(updatedOrders)
      );

      /* CLEAR CART */

      clearCart();

      /* UPDATE UI */

      setOrderId(generatedOrderId);

      setEstimatedDelivery(
        deliveryTime.toLocaleTimeString(
          "en-BD",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        )
      );

      setOrderPlaced(true);
      setPlacingOrder(false);
    } catch (err) {
      console.error(err);

      setError(
        "Order save করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );

      setPlacingOrder(false);
    }
  };

  /* ================================================= */
  /* EMPTY CART */
  /* ================================================= */

  if (
    loaded &&
    cartItems.length === 0 &&
    !orderPlaced
  ) {
    return (
      <main className="min-h-screen bg-[#F7F5F0]">
        <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
            <ShoppingBag
              size={30}
              strokeWidth={1.5}
              className="text-[#777]"
            />
          </div>

          <h1 className="mt-5 text-[18px] font-bold">
            Your cart is empty
          </h1>

          <p className="mt-2 text-[11px] text-[#888]">
            Add products before checkout.
          </p>

          <Link
            href="/"
            className="mt-6 rounded-xl bg-black px-6 py-3 text-[12px] font-bold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!loaded && !orderPlaced) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
        <p className="text-[11px] text-[#888]">
          Loading checkout...
        </p>
      </main>
    );
  }

  /* ================================================= */
  /* SUCCESS SCREEN */
  /* ================================================= */

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] text-[#202020]">
        <div className="mx-auto min-h-screen w-full max-w-[480px] px-4 pb-10">

          <section className="pt-12 text-center">
            <div
              className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full"
              style={{
                backgroundColor: ORANGE,
              }}
            >
              <Check
                size={36}
                strokeWidth={2.2}
                className="text-white"
              />
            </div>

            <p
              className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: ORANGE }}
            >
              Order Confirmed
            </p>

            <h1 className="mt-2 text-[22px] font-bold">
              Order Placed Successfully
            </h1>

            <p className="mt-2 text-[10px] text-[#888]">
              Thank you for shopping with KULAURA BAZAR.
            </p>
          </section>

          <section className="mt-7 rounded-[22px] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-wide text-[#999]">
                  Order ID
                </p>

                <p className="mt-1 text-[12px] font-bold">
                  {orderId}
                </p>
              </div>

              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFF1E7",
                }}
              >
                <Package
                  size={17}
                  strokeWidth={1.8}
                  style={{
                    color: ORANGE,
                  }}
                />
              </div>
            </div>

            <div className="my-4 h-px bg-black/5" />

            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFF1E7",
                }}
              >
                <Truck
                  size={16}
                  strokeWidth={1.8}
                  style={{
                    color: ORANGE,
                  }}
                />
              </div>

              <div>
                <p
                  className="text-[10px] font-bold"
                  style={{
                    color: ORANGE,
                  }}
                >
                  আপনার order ready হচ্ছে
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[#777]">
                  কোনো কিছু জানাতে হলে{" "}
                  <a
                    href="tel:01331556818"
                    className="font-bold text-black"
                  >
                    01331556818
                  </a>{" "}
                  নম্বরে call করুন।
                </p>
              </div>
            </div>

            <div
              className="mt-4 rounded-[16px] p-3.5"
              style={{
                backgroundColor: "#F7F5F0",
              }}
            >
              <div className="flex items-center gap-2">
                <Clock3
                  size={15}
                  strokeWidth={1.8}
                  style={{
                    color: ORANGE,
                  }}
                />

                <div>
                  <p className="text-[8px] text-[#999]">
                    ESTIMATED DELIVERY
                  </p>

                  <p className="mt-0.5 text-[12px] font-bold">
                    Around {estimatedDelivery}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-[8px] leading-4 text-[#888]">
                {deliveryMethod === "premium"
                  ? "Premium Delivery selected — around 30 minutes."
                  : "Average Delivery selected — expected within 8 hours."}
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-[22px] bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[8px] font-bold uppercase tracking-[0.12em]"
                  style={{
                    color: ORANGE,
                  }}
                >
                  KULAURA BAZAR
                </p>

                <h2 className="mt-1 text-[12px] font-bold">
                  Featured Products
                </h2>
              </div>

              <span className="text-[8px] text-[#aaa]">
                Advertisement
              </span>
            </div>

            <div className="mt-3 rounded-[16px] border border-black/5 bg-[#FCFBF9] p-3">
              <p className="text-[10px] font-semibold">
                আপনার জন্য আরও products আসছে
              </p>

              <p className="mt-1 text-[8px] leading-4 text-[#888]">
                Grocery, stationery, beauty এবং
                daily essentials-এর নতুন products
                খুব শীঘ্রই available হবে।
              </p>
            </div>
          </section>

          <div className="mt-5 space-y-2.5">
            <Link
              href="/"
              className="flex h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-black text-[11px] font-bold text-white"
            >
              Back to Homepage

              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </Link>

            <Link
              href="/history"
              className="flex h-[48px] w-full items-center justify-center rounded-2xl border border-black/10 bg-white text-[11px] font-bold"
            >
              Order History
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <ShieldCheck
              size={13}
              strokeWidth={1.7}
              className="text-[#888]"
            />

            <span className="text-[8px] text-[#888]">
              Your order information is saved securely
            </span>
          </div>
        </div>
      </main>
    );
  }

  /* ================================================= */
  /* NORMAL CHECKOUT */
  /* ================================================= */

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#202020]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] pb-8">

        {/* HEADER */}

        <header className="flex h-[62px] items-center justify-between px-4">
          <Link
            href="/cart"
            className="flex h-9 w-9 items-center justify-center"
          >
            <ArrowLeft
              size={21}
              strokeWidth={1.8}
            />
          </Link>

          <h1 className="text-[15px] font-bold">
            Checkout
          </h1>

          <div className="w-9" />
        </header>

        {/* STEPS */}

        <section className="border-y border-black/5 bg-white px-4 py-3">
          <div className="flex items-center">
            <Step
              number={1}
              title="Information"
              active={step === 1}
              completed={step > 1}
            />

            <Connector active={step > 1} />

            <Step
              number={2}
              title="Delivery"
              active={step === 2}
              completed={step > 2}
            />

            <Connector active={step > 2} />

            <Step
              number={3}
              title="Payment"
              active={step === 3}
              completed={step > 3}
            />

            <Connector active={step > 3} />

            <Step
              number={4}
              title="Confirm"
              active={step === 4}
              completed={false}
            />
          </div>
        </section>

        {/* ================================================= */}
        {/* STEP 1 */}
        {/* ================================================= */}

        {step === 1 && (
          <section className="px-4 pt-5">
            <Heading
              icon={
                <User
                  size={18}
                  strokeWidth={1.8}
                />
              }
              title="Your Information"
              subtitle="Enter your delivery details"
            />

            <div className="mt-4 rounded-[20px] bg-white p-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={setFullName}
                icon={<User size={16} />}
                required
              />

              <div className="mt-4">
                <Input
                  label="Phone Number"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={setPhone}
                  icon={<Phone size={16} />}
                  type="tel"
                  required
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Area / Location"
                  placeholder="Chowdhury Bazar"
                  value={area}
                  onChange={setArea}
                  icon={<MapPin size={16} />}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="text-[9px] font-semibold text-[#444]">
                    Full Address

                    <span
                      className="ml-1"
                      style={{
                        color: ORANGE,
                      }}
                    >
                      *
                    </span>
                  </span>

                  <textarea
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    placeholder="House, road, village, market..."
                    rows={3}
                    className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-[#FCFBF9] p-3 text-[11px] outline-none transition focus:border-black"
                  />
                </label>
              </div>

              <div className="mt-4">
                <label className="block">
                  <span className="text-[9px] font-semibold text-[#444]">
                    Landmark

                    <span className="ml-1 text-[#aaa]">
                      (Optional)
                    </span>
                  </span>

                  <input
                    value={landmark}
                    onChange={(e) =>
                      setLandmark(e.target.value)
                    }
                    placeholder="Nearby mosque, school, shop..."
                    className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-[#FCFBF9] px-3 text-[11px] outline-none focus:border-black"
                  />
                </label>
              </div>
            </div>

            {error && (
              <ErrorMessage text={error} />
            )}

            <BottomButton
              text="Continue to Delivery"
              onClick={goToDelivery}
            />
          </section>
        )}

        {/* ================================================= */}
        {/* STEP 2 */}
        {/* ================================================= */}

        {step === 2 && (
          <section className="px-4 pt-5">
            <Heading
              icon={
                <Truck
                  size={18}
                  strokeWidth={1.8}
                />
              }
              title="Delivery"
              subtitle="Choose your preferred delivery"
            />

            {/* PROGRESS */}

            <div className="mt-5 px-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-[#666]">
                  ৳{subtotal} / ৳999
                </span>

                {amountRemaining > 0 ? (
                  <span
                    className="text-[9px] font-semibold"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    আরও ৳{amountRemaining} কিনুন
                  </span>
                ) : (
                  <span
                    className="text-[9px] font-bold"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    Free Delivery Unlocked
                  </span>
                )}
              </div>

              <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#DDD9D2]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-black transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />

                <div
                  className="absolute right-0 top-[-2px] h-[7px] w-[7px] rounded-full"
                  style={{
                    backgroundColor: ORANGE,
                  }}
                />
              </div>
            </div>

            {/* PREMIUM */}

            <button
              type="button"
              onClick={() =>
                setDeliveryMethod("premium")
              }
              className={`mt-4 w-full rounded-[18px] bg-white p-3.5 text-left transition ${
                deliveryMethod === "premium"
                  ? "ring-1 ring-black shadow-[0_7px_25px_rgba(0,0,0,0.05)]"
                  : "border border-black/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  selected={
                    deliveryMethod === "premium"
                  }
                />

                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Truck
                    size={37}
                    strokeWidth={1.7}
                    className="truck-premium"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[12px] font-bold">
                      Premium Delivery
                    </h3>

                    <span
                      className="rounded-full px-2 py-[3px] text-[7px] font-bold text-white"
                      style={{
                        backgroundColor: ORANGE,
                      }}
                    >
                      FAST
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1 text-[8px] text-[#888]">
                    <Clock3
                      size={10}
                      strokeWidth={1.7}
                    />

                    Around 30 minutes
                  </div>
                </div>

                <div className="text-right">
                  {premiumCharge === 0 ? (
                    <span
                      className="text-[13px] font-bold"
                      style={{
                        color: ORANGE,
                      }}
                    >
                      FREE
                    </span>
                  ) : (
                    <span className="text-[13px] font-bold">
                      ৳30
                    </span>
                  )}
                </div>
              </div>
            </button>

            <div className="mt-2 flex items-start gap-2 px-2">
              <span
                className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: ORANGE,
                }}
              />

              <p className="text-[8.5px] leading-4 text-[#777]">
                <span className="font-semibold text-[#333]">
                  নোট:
                </span>{" "}
                ৫টি product + ৳999 হলে Premium FREE।
                না হলে ৳30।
              </p>
            </div>

            {productCount < 5 && (
              <p className="mt-1 px-2 text-[8px] text-[#aaa]">
                আরও {5 - productCount}টি product যোগ করলে
                ৫টি product-এর শর্ত পূরণ হবে।
              </p>
            )}

            {/* AVERAGE */}

            <button
              type="button"
              onClick={() =>
                setDeliveryMethod("average")
              }
              className={`mt-4 w-full rounded-[18px] bg-white p-3.5 text-left transition ${
                deliveryMethod === "average"
                  ? "ring-1 ring-black shadow-[0_7px_25px_rgba(0,0,0,0.05)]"
                  : "border border-black/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  selected={
                    deliveryMethod === "average"
                  }
                />

                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Truck
                    size={35}
                    strokeWidth={1.7}
                    className="truck-average"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-[12px] font-bold">
                    Average Delivery
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1 text-[8px] text-[#888]">
                    <Clock3
                      size={10}
                      strokeWidth={1.7}
                    />

                    Within 8 hours
                  </div>
                </div>

                <span
                  className="text-[13px] font-bold"
                  style={{
                    color: ORANGE,
                  }}
                >
                  FREE
                </span>
              </div>
            </button>

            <p className="mt-2 px-2 text-[8.5px] leading-4 text-[#888]">
              Average Delivery সাধারণত order করার
              সময় থেকে ৮ ঘণ্টার মধ্যে পৌঁছাবে।
            </p>

            <BottomButton
              text="Continue to Payment"
              onClick={goToPayment}
            />
          </section>
        )}

        {/* ================================================= */}
        {/* STEP 3 */}
        {/* ================================================= */}

        {step === 3 && (
          <section className="px-4 pt-5">
            <Heading
              icon={
                <CreditCard
                  size={18}
                  strokeWidth={1.8}
                />
              }
              title="Payment"
              subtitle="Choose your payment method"
            />

            <div className="mt-4 space-y-2.5">
              <PaymentCard
                title="Cash on Delivery"
                subtitle="Pay when you receive"
                icon={
                  <HandCoins
                    size={20}
                    strokeWidth={1.8}
                    className="text-black"
                  />
                }
                selected={
                  paymentMethod === "cod"
                }
                onClick={() =>
                  setPaymentMethod("cod")
                }
              />

              <PaymentCard
                title="bKash"
                subtitle="Pay securely with bKash"
                icon={
                  <span
                    className="text-[12px] font-black"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    bK
                  </span>
                }
                selected={
                  paymentMethod === "bkash"
                }
                onClick={() =>
                  setPaymentMethod("bkash")
                }
              />

              <PaymentCard
                title="Bangla QR"
                subtitle="Scan & pay"
                icon={
                  <CreditCard
                    size={18}
                    strokeWidth={1.8}
                  />
                }
                selected={
                  paymentMethod === "qr"
                }
                onClick={() =>
                  setPaymentMethod("qr")
                }
              />
            </div>

            {paymentMethod === "cod" && (
              <div className="mt-3 flex items-start gap-2 px-2">
                <span
                  className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: ORANGE,
                  }}
                />

                <p className="text-[8.5px] leading-4 text-[#777]">
                  <span className="font-semibold text-[#333]">
                    নোট:
                  </span>{" "}
                  Delivery-এর সময় চাইলে bKash বা
                  Bangla QR-এ payment করা যাবে।
                </p>
              </div>
            )}

            <BottomButton
              text="Continue to Confirm"
              onClick={goToConfirm}
            />
          </section>
        )}

        {/* ================================================= */}
        {/* STEP 4 */}
        {/* ================================================= */}

        {step === 4 && (
          <section className="px-4 pt-5">
            <Heading
              icon={
                <Check
                  size={18}
                  strokeWidth={2}
                />
              }
              title="Review Order"
              subtitle="Check your information before ordering"
            />

            {/* RECEIPT */}

            <div className="relative mt-4 overflow-hidden rounded-[22px] bg-white">
              <div className="border-b border-dashed border-[#D9D6D0] px-4 py-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-black">
                  <ShoppingBag
                    size={18}
                    strokeWidth={1.7}
                    className="text-white"
                  />
                </div>

                <h2 className="mt-2 text-[13px] font-bold">
                  KULAURA BAZAR
                </h2>

                <p className="mt-0.5 text-[8px] text-[#999]">
                  Order Summary
                </p>
              </div>

              {/* CUSTOMER */}

              <div className="border-b border-dashed border-[#D9D6D0] px-4 py-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-wide text-[#999]">
                      Customer
                    </p>

                    <p className="mt-1 text-[10px] font-semibold">
                      {fullName}
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#777]">
                      {phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[8px] font-bold"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    EDIT
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-[8px] uppercase tracking-wide text-[#999]">
                    Delivery Address
                  </p>

                  <p className="mt-1 text-[9px] font-semibold">
                    {area}
                  </p>

                  <p className="mt-0.5 text-[9px] leading-4 text-[#777]">
                    {address}
                  </p>

                  {landmark && (
                    <p className="mt-0.5 text-[8px] text-[#999]">
                      Landmark: {landmark}
                    </p>
                  )}
                </div>
              </div>

              {/* PRODUCTS */}

              <div className="border-b border-dashed border-[#D9D6D0] px-4 py-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[8px] uppercase tracking-wide text-[#999]">
                    Products
                  </p>

                  <span className="text-[8px] text-[#999]">
                    {productCount} item
                    {productCount !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {cartItems.map(
                    ({
                      product,
                      quantity,
                    }) => {
                      const price =
                        getProductPrice(
                          product,
                          quantity
                        );

                      return (
                        <div
                          key={product.id}
                          className="flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold">
                              {product.name}
                            </p>

                            <p className="mt-0.5 text-[8px] text-[#999]">
                              {formatQuantity(
                                quantity,
                                product.unit
                              )}
                            </p>
                          </div>

                          <p className="shrink-0 text-[10px] font-semibold">
                            ৳{price}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* TOTAL */}

              <div className="px-4 py-3.5">
                <div className="flex justify-between text-[9px]">
                  <span className="text-[#777]">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ৳{subtotal}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-[9px]">
                  <span className="text-[#777]">
                    {deliveryMethod === "premium"
                      ? "Premium Delivery"
                      : "Average Delivery"}
                  </span>

                  <span
                    className="font-semibold"
                    style={{
                      color:
                        deliveryCharge === 0
                          ? ORANGE
                          : "#222",
                    }}
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `৳${deliveryCharge}`}
                  </span>
                </div>

                <div className="mt-3 border-t border-black/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold">
                      Total
                    </span>

                    <span
                      className="text-[19px] font-bold"
                      style={{
                        color: ORANGE,
                      }}
                    >
                      ৳{total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DELIVERY / PAYMENT */}

            <div className="mt-3 flex gap-2">
              <div className="flex-1 rounded-[16px] bg-white p-3">
                <p className="text-[8px] text-[#999]">
                  DELIVERY
                </p>

                <p className="mt-1 text-[9px] font-bold">
                  {deliveryMethod === "premium"
                    ? "Premium"
                    : "Average"}
                </p>
              </div>

              <div className="flex-1 rounded-[16px] bg-white p-3">
                <p className="text-[8px] text-[#999]">
                  PAYMENT
                </p>

                <p className="mt-1 text-[9px] font-bold">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : paymentMethod === "bkash"
                    ? "bKash"
                    : "Bangla QR"}
                </p>
              </div>
            </div>

            {error && (
              <ErrorMessage text={error} />
            )}

            {/* PLACE ORDER */}

            <button
              type="button"
              onClick={placeOrder}
              disabled={placingOrder}
              className={`mt-4 flex h-[49px] w-full items-center justify-center gap-2 rounded-2xl bg-black text-[11px] font-bold text-white transition ${
                placingOrder
                  ? "cursor-not-allowed opacity-60"
                  : "active:scale-[0.98]"
              }`}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}

              {!placingOrder && (
                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                />
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck
                size={13}
                strokeWidth={1.7}
                className="text-[#888]"
              />

              <span className="text-[8px] text-[#888]">
                Your information is secure
              </span>
            </div>
          </section>
        )}
      </div>

      {/* TRUCK ANIMATION */}

      <style jsx>{`
        @keyframes premiumTruck {
          0% {
            transform: translateX(-3px);
          }

          50% {
            transform: translateX(4px);
          }

          100% {
            transform: translateX(-3px);
          }
        }

        @keyframes averageTruck {
          0% {
            transform: translateX(-2px);
          }

          50% {
            transform: translateX(2px);
          }

          100% {
            transform: translateX(-2px);
          }
        }

        .truck-premium {
          animation: premiumTruck 1.3s ease-in-out infinite;
          color: #111;
        }

        .truck-average {
          animation: averageTruck 2s ease-in-out infinite;
          color: #111;
        }
      `}</style>
    </main>
  );
}

/* ================================================= */
/* STEP */
/* ================================================= */

function Step({
  number,
  title,
  active,
  completed,
}: {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex min-w-[58px] flex-col items-center">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ${
          active
            ? "bg-black text-white"
            : completed
            ? "bg-[#E47B32] text-white"
            : "bg-[#E7E5E1] text-[#888]"
        }`}
      >
        {completed ? (
          <Check
            size={13}
            strokeWidth={2.2}
          />
        ) : (
          number
        )}
      </div>

      <span
        className={`mt-1 text-[7px] font-semibold ${
          active
            ? "text-black"
            : "text-[#999]"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

/* ================================================= */
/* CONNECTOR */
/* ================================================= */

function Connector({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className={`mb-4 mx-1 h-[1px] flex-1 ${
        active
          ? "bg-[#E47B32]"
          : "bg-[#DDD]"
      }`}
    />
  );
}

/* ================================================= */
/* HEADING */
/* ================================================= */

function Heading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        {icon}
      </div>

      <div>
        <h2 className="text-[14px] font-bold">
          {title}
        </h2>

        <p className="mt-0.5 text-[8px] text-[#999]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ================================================= */
/* INPUT */
/* ================================================= */

function Input({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[9px] font-semibold text-[#444]">
        {label}

        {required && (
          <span
            className="ml-1"
            style={{
              color: ORANGE,
            }}
          >
            *
          </span>
        )}
      </span>

      <div className="mt-1.5 flex h-11 items-center rounded-xl border border-black/10 bg-[#FCFBF9] px-3 focus-within:border-black">
        <span className="text-[#999]">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="ml-3 h-full w-full bg-transparent text-[11px] outline-none placeholder:text-[#aaa]"
        />
      </div>
    </label>
  );
}

/* ================================================= */
/* RADIO */
/* ================================================= */

function Radio({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <div
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
        selected
          ? "border-black"
          : "border-[#bbb]"
      }`}
    >
      {selected && (
        <span className="h-2.5 w-2.5 rounded-full bg-black" />
      )}
    </div>
  );
}

/* ================================================= */
/* PAYMENT CARD */
/* ================================================= */

function PaymentCard({
  title,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[18px] bg-white p-3.5 text-left ${
        selected
          ? "ring-1 ring-black"
          : "border border-black/5"
      }`}
    >
      <Radio selected={selected} />

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3F1ED]">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-bold">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-[#999]">
          {subtitle}
        </p>
      </div>

      {selected && (
        <Check
          size={15}
          strokeWidth={2}
          style={{
            color: ORANGE,
          }}
        />
      )}
    </button>
  );
}

/* ================================================= */
/* ERROR */
/* ================================================= */

function ErrorMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-2 px-2">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: ORANGE,
        }}
      />

      <p
        className="text-[9px] font-medium"
        style={{
          color: ORANGE,
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* ================================================= */
/* BOTTOM BUTTON */
/* ================================================= */

function BottomButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-black text-[11px] font-bold text-white transition active:scale-[0.98]"
    >
      {text}

      <ArrowRight
        size={16}
        strokeWidth={1.8}
      />
    </button>
  );
}