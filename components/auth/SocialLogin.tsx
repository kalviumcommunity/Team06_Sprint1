"use client";

import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
  return (
    <button
      type="button"
      disabled
      className="
        mt-5
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-gray-300
        bg-gray-100
        py-3
        font-medium
        text-gray-500
        cursor-not-allowed
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-400
      "
    >
      <FcGoogle size={22} />
      <span>Continue with Google (Coming Soon)</span>
    </button>
  );
}