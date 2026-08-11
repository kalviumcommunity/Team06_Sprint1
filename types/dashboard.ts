export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export interface StatItem {
  title: string;
  value: string;
  actionLabel?: string;
  actionHref?: string;
  icon: string;
  tone?: "green" | "violet" | "amber" | "slate";
  status?: string;
}

export interface DeliveryItem {
  name: string;
  date: string;
  time: string;
  daysLeft: number;
  status?: "Scheduled" | "In Transit";
  quantity?: string;
}

export interface SubscriptionItem {
  medicine: string;
  frequency: string;
  nextDelivery: string;
  status: "Active" | "Paused" | "Pending";
}

export interface OrderItem {
  orderId: string;
  medicine: string;
  date: string;
  amount: string;
  deliveredDate?: string;
  status: "Delivered";
}

export interface ProductItem {
  name: string;
  tag: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  image: string;
}

export interface CategoryItem {
  name: string;
  description: string;
  accent: string;
  href: string;
}

export interface CategoryPill {
  name: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface MoneySavedSummary {
  amount: string;
  comparison: string;
  percentage: string;
}

export interface ReminderInfo {
  medicine: string;
  time: string;
}
