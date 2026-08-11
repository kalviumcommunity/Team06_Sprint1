"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import AuthButton from "./AuthButton";
import AuthFooter from "./AuthFooter";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    place: "",
    password: "",
    confirmPassword: "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          dob: form.dob,
          gender: form.gender,
          email: form.email,
          phone: form.phone,
          place: form.place,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

      {/* Name */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AuthInput
          label="First Name"
          placeholder="Enter first name"
          type="text"
          value={form.firstName}
          onChange={set("firstName")}
          required
        />

        <AuthInput
          label="Last Name"
          placeholder="Enter last name"
          type="text"
          value={form.lastName}
          onChange={set("lastName")}
          required
        />
      </div>

      {/* DOB + Gender */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <AuthInput
          label="Date of Birth"
          type="date"
          value={form.dob}
          onChange={set("dob")}
          required
        />

        <div className="space-y-2">

          <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            Gender
          </label>

          <select
            value={form.gender}
            onChange={set("gender")}
            required
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-50
              px-4
              py-3
              text-gray-900
              outline-none

              transition-all
              duration-300

              focus:border-teal-500
              focus:bg-white
              focus:ring-2
              focus:ring-teal-200

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white

              dark:focus:border-teal-500
              dark:focus:bg-slate-800
              dark:focus:ring-teal-500/30
            "
          >
            <option value="" disabled>
              Select Gender
            </option>

            <option value="Male">Male</option>

            <option value="Female">Female</option>

            <option value="Other">Other</option>

          </select>

        </div>

      </div>

      {/* Contact */}

      <AuthInput
        label="Email Address"
        type="email"
        placeholder="Enter email"
        value={form.email}
        onChange={set("email")}
        required
      />

      <AuthInput
        label="Phone Number"
        type="tel"
        placeholder="Enter phone number"
        value={form.phone}
        onChange={set("phone")}
        required
      />

      <AuthInput
        label="Place / City"
        type="text"
        placeholder="Enter your city"
        value={form.place}
        onChange={set("place")}
        required
      />

      {/* Password */}

      <PasswordInput
        label="Password"
        placeholder="Create password"
        value={form.password}
        onChange={set("password")}
        required
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        required
      />

      {/* Terms */}

      <div className="flex items-start gap-3">

        <input
          id="terms"
          type="checkbox"
          required
          className="
            mt-1
            h-4
            w-4
            rounded
            border-gray-300
            text-teal-600

            focus:ring-teal-500

            dark:border-slate-700
            dark:bg-slate-800
          "
        />

        <label
          htmlFor="terms"
          className="text-sm text-gray-600 dark:text-slate-400"
        >
          I agree to the Terms &amp; Conditions and Privacy Policy.
        </label>

      </div>

      <AuthButton
        title={loading ? "Creating Account..." : "Create Account"}
        disabled={loading}
      />

      <AuthFooter
        text="Already have an account?"
        linkText="Sign In"
        href="/login"
      />

    </form>
  );
}