"use client";

import { signOut } from "next-auth/react";

export async function logoutUser() {
  await signOut({ callbackUrl: "/login" });
}
