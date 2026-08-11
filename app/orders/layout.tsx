"use client";

import PortalLayout from "@/components/layout/PortalLayout";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="USER">{children}</PortalLayout>;
}
