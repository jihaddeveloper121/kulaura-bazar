"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  LogIn,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  logoutUser,
  type CustomerUser,
} from "@/lib/auth";

export default function AccountPage() {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      setUser(getCurrentUser());
      setIsLoading(false);
    };

    loadUser();

    const handleAuthUpdate = () => {
      loadUser();
    };

    window.addEventListener("auth-updated", handleAuthUpdate);

    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdate);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5]">
          <header className="flex h-[64px] items-center border-b border-black/[0.06] px-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-9 w-9 items-center justify-center"
            >
              <ArrowLeft size={21} strokeWidth={1.8} />
            </Link>

            <h1 className="ml-3 text-[18px] font-bold">
              My Account
            </h1>
          </header>

          <div className="flex justify-center px-5 pt-16">
            <p className="text-[12px] text-gray-400">
              Loading account...
            </p>
          </div>
        </div>
      </main>
    );
  }

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
            <ArrowLeft size={21} strokeWidth={1.8} />
          </Link>

          <h1 className="ml-3 text-[18px] font-bold">
            My Account
          </h1>
        </header>

        {!user ? (
          /* NOT LOGGED IN */
          <section className="px-5 pt-12">
            <div className="text-center">
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
                Login to manage your account, orders, wishlist and
                personal information.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#17211b] px-6 text-[13px] font-bold text-white transition active:scale-[0.98]"
              >
                <LogIn size={17} strokeWidth={1.9} />
                Login
              </Link>
            </div>

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
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-[#e9eee9]">
                <UserRound
                  size={29}
                  strokeWidth={1.6}
                  className="text-[#356a47]"
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-[17px] font-bold">
                  {user.name}
                </h2>

                <p className="mt-1 truncate text-[11px] text-gray-500">
                  {user.email}
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

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[62px] w-full items-center border-b border-black/[0.06] text-left"
              >
                <LogOut
                  size={21}
                  strokeWidth={1.8}
                  className="mr-4 text-[#356a47]"
                />

                <span className="flex-1 text-[15px] font-bold">
                  Logout
                </span>
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}