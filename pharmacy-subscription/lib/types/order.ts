export type OrderStatus =
  | 'Order Placed'
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderId?: string;
  medicineId?: string;
  medicineName: string;
  dosage?: string;
  quantity: number;
  unitPrice: number;
  price?: number;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  completedAt?: Date | string | null;
}

export interface OrderTracking {
  trackingNumber: string;
  currentStatus: OrderStatus;
  steps: OrderTrackingStep[];
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  orderDate?: string | Date;
  status: OrderStatus;
  price: number;
  totalAmount: number;
  address: string;
  deliveryAddress?: string;
  trackingId?: string | null;
  tracking?: OrderTracking;
  medicines: string[];
  items: OrderItem[];
  customerId?: string;
  createdAt?: string | Date;
}

export interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}
