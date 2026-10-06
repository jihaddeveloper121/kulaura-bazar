"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { saveCurrentUser } from "@/lib/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    const user = {
      id: `customer-${Date.now()}`,
      name: cleanEmail.split("@")[0] || "Customer",
      email: cleanEmail,
    };

    saveCurrentUser(user);

    window.location.href = "/account";
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5]">
        <header className="flex h-[64px] items-center px-4">
          <Link
            href="/account"
            aria-label="Back to account"
            className="flex h-9 w-9 items-center justify-center"
          >
            <ArrowLeft size={21} strokeWidth={1.8} />
          </Link>
        </header>

        <section className="px-5 pt-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#356a47]">
              KULAURA BAZAR
            </p>

            <h1 className="mt-2 text-[26px] font-bold tracking-[-0.02em]">
              Welcome back
            </h1>

            <p className="mt-2 text-[12px] leading-5 text-gray-500">
              Login to continue shopping and manage your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12px] font-bold"
              >
                Email
              </label>

              <div className="flex h-[50px] items-center rounded-xl border border-black/[0.08] bg-white px-3 focus-within:border-[#356a47]">
                <Mail
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="ml-3 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-2 block text-[12px] font-bold"
              >
                Password
              </label>

              <div className="flex h-[50px] items-center rounded-xl border border-black/[0.08] bg-white px-3 focus-within:border-[#356a47]">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="ml-3 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] leading-4 text-red-600">
                {error}
              </p>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="text-[11px] font-semibold text-[#356a47]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex h-[50px] w-full items-center justify-center rounded-xl bg-[#17211b] text-[13px] font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-gray-500">
              Don't have an account?
            </p>

            <Link
              href="/register"
              className="mt-1 inline-block text-[12px] font-bold text-[#356a47]"
            >
              Create an account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}