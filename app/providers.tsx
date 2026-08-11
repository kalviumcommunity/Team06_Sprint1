"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "./context/ThemeProvider";
import { NotificationProvider } from "./context/NotificationProvider";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <ThemeProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}