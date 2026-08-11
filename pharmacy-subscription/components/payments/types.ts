// Payment status types
export type PaymentStatus = "success" | "pending" | "failed" | "retrying";

// Sort options
export type SortOption = "newest" | "oldest" | "highest" | "lowest";

// Filter options
export type FilterOption = "all" | PaymentStatus;

// Payment data interface
export interface Payment {
  id: string;
  paymentId: string;
  status: PaymentStatus;
  orderId: string;
  method: string;
  date: string;
  amount: number;
  rawDate: Date;
  // Extended fields for full payment flow
  transactionId?: string;       // e.g. TXN-8f2a91bc
  subscriptionName?: string;    // "Monthly Medicine Plan"
  failureReason?: string;       // populated on failed payments
  paymentFailedAt?: string | null;
  retryAvailableAt?: string | null;
}

// Payment method category
export type PaymentMethodCategory = "upi" | "card" | "wallet";

// UPI app options
export type UpiApp = "googlepay" | "phonepe" | "paytm" | "bhim";

// Wallet options
export type WalletOption = "paytm" | "amazonpay" | "mobikwik";

// Card brand
export type CardBrand = "visa" | "mastercard" | "rupay" | "amex" | "unknown";

// Payment method selected in the modal
export interface SelectedPaymentMethod {
  category: PaymentMethodCategory;
  upiApp?: UpiApp;
  upiId?: string;
  walletOption?: WalletOption;
  netBankingBank?: string;
  cardLast4?: string;
  cardBrand?: CardBrand;
  displayLabel: string; // human-readable e.g. "Google Pay", "Visa ••••4521"
}


// Saved payment method types
export type SavedMethodType = "visa" | "mastercard" | "googlepay" | "phonepe" | "paytm";

// Saved payment method interface
export interface SavedPaymentMethod {
  id: string;
  type: SavedMethodType;
  name: string;
  maskedNumber?: string;
  isDefault: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

// Toast notification
export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
