"use client";

import { useSession } from "next-auth/react";
import PortalLayout from "@/components/layout/PortalLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role === "ADMIN" ? "ADMIN" : "USER";

  return <PortalLayout role={role}>{children}</PortalLayout>;
}
