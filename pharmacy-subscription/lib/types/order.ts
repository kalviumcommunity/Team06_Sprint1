// Order types for backend integration

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  price: number;
}

export interface OrderTracking {
  trackingNumber: string;
  currentStatus: OrderStatus;
  steps: {
    status: OrderStatus;
    completedAt?: Date | null;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date | string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  tracking: OrderTracking;
  customerId: string;
}

export interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
