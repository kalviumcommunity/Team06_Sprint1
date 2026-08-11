"use client";

import PortalLayout from "@/components/layout/PortalLayout";

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="USER">{children}</PortalLayout>;
}
