export interface Medicine {
  id: string;
  name: string;
  description?: string | null;
  manufacturer: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  medicineId: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  quantity: number;
  startDate: string | Date;
  nextRefill: string | Date;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  remainingRefills?: number;
  deliveryAddress?: string;
  paymentMethod?: string;
  medicine?: Medicine;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
