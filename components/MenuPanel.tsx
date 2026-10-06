"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  FileText,
  Heart,
  LogIn,
  MessageSquareWarning,
  Share2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

type MenuPanelProps = {
  open: boolean;
  onClose: () => void;
};

type Language = "EN" | "BN";

const menuItems = [
  {
    key: "privacy",
    labelEN: "Privacy",
    labelBN: "গোপনীয়তা",
    href: "/privacy",
    icon: FileText,
  },
  {
    key: "report",
    labelEN: "Report System",
    labelBN: "রিপোর্ট সিস্টেম",
    href: "/report",
    icon: MessageSquareWarning,
  },
  {
    key: "ai",
    labelEN: "AI Help",
    labelBN: "AI সহায়তা",
    href: "/ai-help",
    icon: Bot,
  },
  {
    key: "social",
    labelEN: "Social Engagements",
    labelBN: "সামাজিক যোগাযোগ",
    href: "/social",
    icon: Share2,
  },
  {
    key: "wishlist",
    labelEN: "Wishlist",
    labelBN: "উইশলিস্ট",
    href: "/wishlist",
    icon: Heart,
  },
  {
    key: "account",
    labelEN: "My Account",
    labelBN: "আমার অ্যাকাউন্ট",
    href: "/account",
    icon: UserRound,
  },
];

export default function MenuPanel({
  open,
  onClose,
}: MenuPanelProps) {
  const [language, setLanguage] = useState<Language>("EN");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "kulaura-language"
    );

    if (savedLanguage === "BN" || savedLanguage === "EN") {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (value: Language) => {
    setLanguage(value);

    localStorage.setItem(
      "kulaura-language",
      value
    );

    document.documentElement.lang =
      value === "BN" ? "bn" : "en";

    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: value,
      })
    );
  };

  if (!open) {
    return null;
  }

  return (
    <>
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/25"
      />

      {/* SIDE DRAWER */}
      <aside
        className="
          fixed
          left-0
          top-0
          z-[100]
          flex
          h-screen
          w-[86%]
          max-w-[360px]
          flex-col
          bg-[#f7f8f5]
          shadow-[8px_0_30px_rgba(0,0,0,0.12)]
        "
      >
        {/* HEADER */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-black/[0.07] px-5">

          {/* LOGO */}
          <Link
            href="/"
            onClick={onClose}
            className="relative h-[48px] w-[130px]"
          >
            <Image
              src="/logo.svg"
              alt="KULAURA BAZAR"
              fill
              sizes="130px"
              priority
              className="object-contain object-left"
            />
          </Link>

          <div className="flex items-center gap-3">

            {/* LANGUAGE SWITCH */}
            <div className="flex h-9 items-center rounded-full border border-black/[0.08] bg-white p-1">

              <button
                type="button"
                onClick={() => changeLanguage("BN")}
                className={`flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-[10px] font-bold transition-all ${
                  language === "BN"
                    ? "bg-[#17211b] text-white"
                    : "text-gray-500"
                }`}
              >
                BN
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("EN")}
                className={`flex h-7 min-w-8 items-center justify-center rounded-full px-2 text-[10px] font-bold transition-all ${
                  language === "EN"
                    ? "bg-[#17211b] text-white"
                    : "text-gray-500"
                }`}
              >
                EN
              </button>

            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center"
            >
              <X
                size={21}
                strokeWidth={1.8}
              />
            </button>

          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 px-4 pt-3">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="
                  flex
                  h-[58px]
                  items-center
                  gap-4
                  border-b
                  border-black/[0.05]
                  px-2
                  text-[#17211b]
                  transition-colors
                  active:bg-black/[0.04]
                "
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#356a47]"
                />

                <span className="text-[16px] font-bold">
                  {language === "BN"
                    ? item.labelBN
                    : item.labelEN}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* LOGIN AT BOTTOM */}
        <div className="shrink-0 border-t border-black/[0.08] px-4 pb-6 pt-2">

          <Link
            href="/login"
            onClick={onClose}
            className="
              flex
              h-[58px]
              items-center
              gap-4
              px-2
              text-[#17211b]
              transition-colors
              active:bg-black/[0.04]
            "
          >
            <LogIn
              size={21}
              strokeWidth={1.8}
              className="shrink-0 text-[#356a47]"
            />

            <span className="text-[16px] font-bold">
              {language === "BN"
                ? "লগইন"
                : "Login"}
            </span>
          </Link>

        </div>

      </aside>
    </>
  );
}