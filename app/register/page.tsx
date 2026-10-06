"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { saveCurrentUser } from "@/lib/auth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const user = {
      id: `customer-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
    };

    saveCurrentUser(user);

    window.location.href = "/account";
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17211b]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8f5]">
        {/* HEADER */}
        <header className="flex h-[64px] items-center px-4">
          <Link
            href="/account"
            aria-label="Back to account"
            className="flex h-9 w-9 items-center justify-center"
          >
            <ArrowLeft size={21} strokeWidth={1.8} />
          </Link>
        </header>

        {/* CONTENT */}
        <section className="px-5 pt-6">
          {/* TITLE */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#356a47]">
              KULAURA BAZAR
            </p>

            <h1 className="mt-2 text-[26px] font-bold tracking-[-0.02em]">
              Create your account
            </h1>

            <p className="mt-2 text-[12px] leading-5 text-gray-500">
              Create an account to place orders, manage your wishlist and
              track your shopping activity.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-[12px] font-bold"
              >
                Full Name
              </label>

              <div className="flex h-[50px] items-center rounded-xl border border-black/[0.08] bg-white px-3 focus-within:border-[#356a47]">
                <UserRound
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-gray-400"
                />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="ml-3 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="mt-5">
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

            {/* PASSWORD */}
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            {/* CONFIRM PASSWORD */}
            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[12px] font-bold"
              >
                Confirm Password
              </label>

              <div className="flex h-[50px] items-center rounded-xl border border-black/[0.08] bg-white px-3 focus-within:border-[#356a47]">
                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                  className="shrink-0 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="ml-3 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[11px] leading-4 text-red-600">
                {error}
              </p>
            )}

            {/* TERMS */}
            <p className="mt-4 text-[10px] leading-4 text-gray-500">
              By creating an account, you agree to the KULAURA BAZAR terms
              and privacy policy.
            </p>

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 flex h-[50px] w-full items-center justify-center rounded-xl bg-[#17211b] text-[13px] font-bold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-7 pb-8 text-center">
            <p className="text-[11px] text-gray-500">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-block text-[12px] font-bold text-[#356a47]"
            >
              Login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}