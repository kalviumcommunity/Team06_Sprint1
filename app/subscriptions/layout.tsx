"use client";

import PortalLayout from "@/components/layout/PortalLayout";

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayout role="USER">{children}</PortalLayout>;
}
