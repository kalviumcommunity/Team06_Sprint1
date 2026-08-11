import { Payment, SavedPaymentMethod } from "./types";

export const mockPayments: Payment[] = [
  {
    id: "1",
    paymentId: "PAY-4821",
    status: "success",
    orderId: "ORD-9821",
    method: "UPI - Google Pay",
    date: "Jul 12, 2026",
    amount: 166,
    rawDate: new Date(2026, 6, 12),
  },
  {
    id: "2",
    paymentId: "PAY-4745",
    status: "success",
    orderId: "ORD-9745",
    method: "Visa ••••4521",
    date: "Jun 15, 2026",
    amount: 55,
    rawDate: new Date(2026, 5, 15),
  },
  {
    id: "3",
    paymentId: "PAY-4901",
    status: "pending",
    orderId: "ORD-9901",
    method: "Paytm Wallet",
    date: "Jul 14, 2026",
    amount: 96,
    rawDate: new Date(2026, 6, 14),
  },
  {
    id: "4",
    paymentId: "PAY-4622",
    status: "failed",
    orderId: "Subscription Renewal",
    method: "UPI - PhonePe",
    date: "May 01, 2026",
    amount: 83,
    rawDate: new Date(2026, 4, 1),
  },
];

export const mockSavedMethods: SavedPaymentMethod[] = [
  {
    id: "sm-1",
    type: "visa",
    name: "Visa",
    maskedNumber: "••••4521",
    isDefault: true,
  },
  {
    id: "sm-2",
    type: "mastercard",
    name: "MasterCard",
    maskedNumber: "••••7645",
    isDefault: false,
  },
  {
    id: "sm-3",
    type: "googlepay",
    name: "Google Pay",
    isDefault: false,
  },
  {
    id: "sm-4",
    type: "phonepe",
    name: "PhonePe",
    isDefault: false,
  },
  {
    id: "sm-5",
    type: "paytm",
    name: "Paytm Wallet",
    isDefault: false,
  },
];

// Simulated API delay for mock data fetching
export const simulateApiDelay = (ms: number = 800): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Simulate paginated API response
export async function fetchPayments(
  page: number = 1,
  pageSize: number = 4
): Promise<{ payments: Payment[]; totalCount: number }> {
  await simulateApiDelay(800);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    payments: mockPayments.slice(start, end),
    totalCount: mockPayments.length,
  };
}

// Simulate retry payment API call
export async function retryPayment(
  paymentId: string
): Promise<{ success: boolean; message: string }> {
  await simulateApiDelay(1500);
  return {
    success: true,
    message: `Payment ${paymentId} retried successfully!`,
  };
}
