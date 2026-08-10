"use client";

import React from "react";
import PaymentCard from "./paymentCard";
import PaymentSkeleton from "./PaymentSkeleton";
import EmptyState from "./EmptyState";
import type { Payment } from "./types";

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
  onRetry: (payment: Payment) => void;
}

export default function PaymentHistory({
  payments,
  loading,
  onRetry,
}: PaymentHistoryProps) {
  if (loading) {
    return <PaymentSkeleton />;
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        message="No payment history available."
        subMessage="Your payments will appear here once you make a purchase."
        isSearchResult={false}
      />
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          index={index}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}
