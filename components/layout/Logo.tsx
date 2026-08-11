"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  mobile?: boolean;
};

export default function Logo({ mobile = false }: LogoProps) {
  return (
    <Link href="/" className="flex w-[320px] items-center">
      <Image
        src="/images/pharmaease-logo.png"
        alt="PharmaEase Logo"
        width={mobile ? 56 : 84}
        height={mobile ? 56 : 84}
        priority
        className={`rounded-full object-cover ${
          mobile ? "h-14 w-14" : "h-20 w-20"
        }`}
      />

      <div className="ml-3">
        <h1
          className={`font-bold text-teal-600 ${
            mobile ? "text-2xl" : "text-4xl"
          }`}
        >
          PharmaEase
        </h1>

        <p className={`text-gray-500 ${mobile ? "text-xs" : "text-sm"}`}>
          Smart Medicine Subscription Platform
        </p>
      </div>
    </Link>
  );
}