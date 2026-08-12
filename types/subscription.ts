export interface Subscription {
  id: string;

  medicineName: string;

  medicineImage: string;

  frequency: string;

  quantity: number;

  nextRefill: string;

  remainingRefills: number;

  paymentMethod: string;

  address: string;

  status:
    | "ACTIVE"
    | "PAUSED"
    | "CANCELLED";

  reminderEnabled: boolean;

  progress: number;
}