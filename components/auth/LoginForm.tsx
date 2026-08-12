"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import AuthButton from "./AuthButton";
import AuthFooter from "./AuthFooter";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      const res = await fetch("/api/auth/session");
      const session = await res.json();

      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      {error && (
        <p
          className="
            rounded-lg
            bg-red-100
            px-4
            py-3
            text-sm
            text-red-700

            dark:bg-red-900/30
            dark:text-red-300
          "
        >
          {error}
        </p>
      )}

      <AuthInput
        label="Email Address"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="
              h-4
              w-4
              rounded
              border-gray-300
              text-teal-600
              focus:ring-teal-500

              dark:border-slate-600
              dark:bg-slate-800
            "
          />

          Remember Me
        </label>

        <Link
          href="/forgot-password"
          className="
            text-sm
            text-teal-600
            transition-colors

            hover:text-teal-700

            dark:text-teal-400
            dark:hover:text-teal-300
          "
        >
          Forgot Password?
        </Link>
      </div>

      <AuthButton
        title={loading ? "Signing in..." : "Sign In"}
        disabled={loading}
      />

      <AuthFooter
        text="Don't have an account?"
        linkText="Create Account"
        href="/register"
      />
    </form>
  );
}