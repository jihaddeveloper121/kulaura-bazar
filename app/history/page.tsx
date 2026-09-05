"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

const ORANGE = "#E47B32";

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
    price: number | null;
  }[];

  deliveryMethod: "premium" | "average";
  paymentMethod: "cod" | "bkash" | "qr";

  subtotal: number;
  deliveryCharge: number;
  total: number;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          "kulaura-bazar-orders"
        ) || "[]"
      );

      setOrders(saved);
    } catch {
      setOrders([]);
    }

    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#202020]">

      <div className="mx-auto min-h-screen w-full max-w-[480px] pb-10">

        {/* HEADER */}

        <header className="flex h-[62px] items-center justify-between px-4">

          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center"
          >
            <ArrowLeft
              size={21}
              strokeWidth={1.8}
            />
          </Link>

          <h1 className="text-[15px] font-bold">
            Order History
          </h1>

          <div className="w-9" />

        </header>

        {/* CONTENT */}

        <section className="px-4 pt-4">

          {!loaded ? (
            <p className="py-10 text-center text-[10px] text-[#888]">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (

            <div className="flex flex-col items-center justify-center rounded-[22px] bg-white px-6 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F1ED]">

                <ShoppingBag
                  size={27}
                  strokeWidth={1.5}
                  className="text-[#777]"
                />

              </div>

              <h2 className="mt-4 text-[14px] font-bold">
                No orders yet
              </h2>

              <p className="mt-1 text-[9px] text-[#999]">
                Your completed orders will appear here.
              </p>

              <Link
                href="/"
                className="mt-5 rounded-xl bg-black px-5 py-3 text-[10px] font-bold text-white"
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            <div className="space-y-3">

              {orders.map((order) => (

                <div
                  key={order.id}
                  className="rounded-[20px] bg-white p-4"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-[8px] uppercase tracking-wide text-[#999]">
                        Order
                      </p>

                      <p className="mt-1 text-[11px] font-bold">
                        {order.id}
                      </p>

                    </div>

                    <span
                      className="rounded-full px-2.5 py-1 text-[7px] font-bold text-white"
                      style={{
                        backgroundColor: ORANGE,
                      }}
                    >
                      PLACED
                    </span>

                  </div>

                  {/* DATE */}

                  <p className="mt-2 text-[8px] text-[#999]">
                    {new Date(
                      order.createdAt
                    ).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <div className="my-3 h-px bg-black/5" />

                  {/* PRODUCTS */}

                  <div className="space-y-2.5">

                    {order.items.map((item) => (

                      <div
                        key={item.productId}
                        className="flex items-start justify-between gap-3"
                      >

                        <div className="min-w-0 flex-1">

                          <p className="text-[9px] font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-[8px] text-[#999]">
                            {item.quantity}
                            {item.unit}
                          </p>

                        </div>

                        <p className="text-[9px] font-semibold">

                          {item.price !== null
                            ? `৳${item.price}`
                            : "Pending"}

                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="my-3 h-px bg-black/5" />

                  {/* DELIVERY */}

                  <div className="flex items-center gap-2">

                    <Truck
                      size={14}
                      strokeWidth={1.7}
                    />

                    <span className="text-[8px] text-[#777]">
                      {order.deliveryMethod ===
                      "premium"
                        ? "Premium Delivery"
                        : "Average Delivery"}
                    </span>

                  </div>

                  {/* PAYMENT */}

                  <div className="mt-2 flex items-center gap-2">

                    <Package
                      size={14}
                      strokeWidth={1.7}
                    />

                    <span className="text-[8px] text-[#777]">

                      {order.paymentMethod ===
                      "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod ===
                          "bkash"
                        ? "bKash"
                        : "Bangla QR"}

                    </span>

                  </div>

                  {/* DELIVERY TIME */}

                  <div
                    className="mt-3 rounded-[14px] p-3"
                    style={{
                      backgroundColor: "#F7F5F0",
                    }}
                  >

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={13}
                        strokeWidth={1.7}
                        style={{
                          color: ORANGE,
                        }}
                      />

                      <div>

                        <p className="text-[7px] text-[#999]">
                          ESTIMATED DELIVERY
                        </p>

                        <p className="mt-0.5 text-[9px] font-bold">

                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleTimeString(
                            "en-BD",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-[10px] font-bold">
                      Total
                    </span>

                    <span
                      className="text-[15px] font-bold"
                      style={{
                        color: ORANGE,
                      }}
                    >
                      ৳{order.total}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}