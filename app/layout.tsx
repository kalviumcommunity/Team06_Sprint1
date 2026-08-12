import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "PharmaEase - Smart Healthcare Subscription Platform",
  description: "Manage medicine subscriptions with automatic refills, smart reminders, secure online payments, multilingual support and doorstep medicine delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  suppressHydrationWarning
>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
