"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  LogIn,
  Package,
  UserRound,
} from "lucide-react";

export default function AccountPage() {
  const isLoggedIn = false;

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5] pb-24">

        {/* HEADER */}
        <header className="flex h-[64px] items-center border-b border-black/[0.06] px-4">

          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center"
          >
            <ArrowLeft
              size={21}
              strokeWidth={1.8}
            />
          </Link>

          <h1 className="ml-3 text-[18px] font-bold">
            My Account
          </h1>

        </header>

        {/* LOGGED OUT */}
        {!isLoggedIn ? (
          <section className="px-5 pt-12">

            <div className="text-center">

              {/* ICON */}
              <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#e9eee9]">
                <UserRound
                  size={34}
                  strokeWidth={1.5}
                  className="text-[#356a47]"
                />
              </div>

              <h2 className="mt-6 text-[22px] font-bold">
                Welcome to KULAURA BAZAR
              </h2>

              <p className="mx-auto mt-2 max-w-[300px] text-[12px] leading-5 text-gray-500">
                Login to manage your account, orders,
                wishlist and personal information.
              </p>

              {/* LOGIN BUTTON */}
              <Link
                href="/login"
                className="mt-7 inline-flex h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#17211b] px-6 text-[13px] font-bold text-white transition active:scale-[0.98]"
              >
                <LogIn
                  size={17}
                  strokeWidth={1.9}
                />

                Login
              </Link>

            </div>

            {/* QUICK LINKS */}
            <div className="mt-12 border-t border-black/[0.06]">

              <Link
                href="/wishlist"
                className="flex min-h-[62px] items-center border-b border-black/[0.06]"
              >
                <Heart
                  size={21}
                  strokeWidth={1.8}
                  className="mr-4 text-[#356a47]"
                />

                <span className="flex-1 text-[15px] font-bold">
                  Wishlist
                </span>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />
              </Link>

              <Link
                href="/history"
                className="flex min-h-[62px] items-center border-b border-black/[0.06]"
              >
                <Package
                  size={21}
                  strokeWidth={1.8}
                  className="mr-4 text-[#356a47]"
                />

                <span className="flex-1 text-[15px] font-bold">
                  My Orders
                </span>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />
              </Link>

            </div>

          </section>
        ) : (
          /* LOGGED IN */
          <section className="px-5 pt-7">

            <div className="flex items-center gap-4 border-b border-black/[0.06] pb-6">

              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#e9eee9]">
                <UserRound
                  size={29}
                  strokeWidth={1.6}
                  className="text-[#356a47]"
                />
              </div>

              <div>
                <h2 className="text-[17px] font-bold">
                  Customer
                </h2>

                <p className="mt-1 text-[11px] text-gray-500">
                  customer@example.com
                </p>
              </div>

            </div>

            <div className="mt-5">

              <Link
                href="/history"
                className="flex min-h-[62px] items-center border-b border-black/[0.06]"
              >
                <Package
                  size={21}
                  strokeWidth={1.8}
                  className="mr-4 text-[#356a47]"
                />

                <span className="flex-1 text-[15px] font-bold">
                  My Orders
                </span>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />
              </Link>

              <Link
                href="/wishlist"
                className="flex min-h-[62px] items-center border-b border-black/[0.06]"
              >
                <Heart
                  size={21}
                  strokeWidth={1.8}
                  className="mr-4 text-[#356a47]"
                />

                <span className="flex-1 text-[15px] font-bold">
                  Wishlist
                </span>

                <ChevronRight
                  size={18}
                  className="text-gray-400"
                />
              </Link>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}