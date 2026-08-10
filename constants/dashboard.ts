import type {
  CategoryItem,
  CategoryPill,
  DeliveryItem,
  MoneySavedSummary,
  NotificationItem,
  OrderItem,
  ProductItem,
  ReminderInfo,
  SidebarItem,
  StatItem,
  SubscriptionItem,
} from "../types/dashboard";

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "Medicines", href: "/dashboard/medicines", icon: "💊" },
  { label: "My Subscriptions & Refills", href: "/dashboard/subscriptions", icon: "🩺" },
  { label: "Orders", href: "/dashboard/orders", icon: "📦" },
  { label: "Payments", href: "/dashboard/payments", icon: "💳" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "🔔" },
  { label: "Profile", href: "/dashboard/profile", icon: "👤" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export const stats: StatItem[] = [
  {
    title: "Active Subscriptions",
    value: "4",
    icon: "💊",
    tone: "green",
    status: "+1 this week",
  },
  {
    title: "Upcoming Delivery",
    value: "3",
    icon: "📦",
    tone: "violet",
    status: "2 today",
  },
  {
    title: "Total Orders",
    value: "18",
    icon: "🧾",
    tone: "amber",
    status: "98% fulfilled",
  },
];


export const upcomingDeliveries: DeliveryItem[] = [
  {
    name: "Metformin 500mg",
    date: "30 Jul 2026",
    time: "9:00 AM",
    daysLeft: 3,
    status: "Scheduled",
    quantity: "30 tablets",
  },
  {
    name: "Atorvastatin 10mg",
    date: "02 Aug 2026",
    time: "9:00 AM",
    daysLeft: 6,
    status: "Scheduled",
    quantity: "1 box",
  },
  {
    name: "Amlodipine 5mg",
    date: "10 Aug 2026",
    time: "9:00 AM",
    daysLeft: 14,
    status: "Scheduled",
    quantity: "1 refill",
  },
];

export const subscriptionItems: SubscriptionItem[] = [
  {
    medicine: "Metformin 500mg",
    frequency: "Daily",
    nextDelivery: "30 Jul 2026",
    status: "Active",
  },
  {
    medicine: "Atorvastatin 10mg",
    frequency: "Daily",
    nextDelivery: "02 Aug 2026",
    status: "Active",
  },
  {
    medicine: "Amlodipine 5mg",
    frequency: "Daily",
    nextDelivery: "10 Aug 2026",
    status: "Active",
  },
  {
    medicine: "Pantoprazole 40mg",
    frequency: "Daily",
    nextDelivery: "25 Aug 2026",
    status: "Active",
  },
];

export const recentOrders: OrderItem[] = [
  {
    orderId: "ORD-4521",
    medicine: "Metformin 500mg",
    date: "24 Jul 2026",
    deliveredDate: "24 Jul 2026",
    amount: "₹240",
    status: "Delivered",
  },
  {
    orderId: "ORD-4518",
    medicine: "Atorvastatin 10mg",
    date: "18 Jul 2026",
    deliveredDate: "18 Jul 2026",
    amount: "₹180",
    status: "Delivered",
  },
  {
    orderId: "ORD-4503",
    medicine: "Amlodipine 5mg",
    date: "10 Jul 2026",
    deliveredDate: "10 Jul 2026",
    amount: "₹160",
    status: "Delivered",
  },
  {
    orderId: "ORD-4490",
    medicine: "Pantoprazole 40mg",
    date: "02 Jul 2026",
    deliveredDate: "02 Jul 2026",
    amount: "₹260",
    status: "Delivered",
  },
];

export const productRecommendations: ProductItem[] = [
  {
    name: "Vitamin C 500mg",
    tag: "New",
    price: "₹199",
    originalPrice: "₹249",
    discount: "20% OFF",
    rating: "4.6",
    image: "/images/vitamin-c.png",
  },
  {
    name: "Calcium Plus",
    tag: "Trending",
    price: "₹299",
    originalPrice: "₹349",
    discount: "10% OFF",
    rating: "4.7",
    image: "/images/calcium-plus.png",
  },
  {
    name: "Omega 3 Fish Oil",
    tag: "Best Seller",
    price: "₹499",
    originalPrice: "₹599",
    discount: "16% OFF",
    rating: "4.8",
    image: "/images/omega-3.png",
  },
  {
    name: "Diabetes Care Pack",
    tag: "Offer",
    price: "₹799",
    originalPrice: "₹999",
    discount: "20% OFF",
    rating: "4.5",
    image: "/images/diabetes-pack.png",
  },
];

export const popularCategories: CategoryItem[] = [
  {
    name: "Diabetes Care",
    description: "Personalized glucose support",
    accent: "from-[#00b386] to-lime-400",
    href: "/categories/diabetes-care",
  },
  {
    name: "Heart Care",
    description: "Cardio wellness selection",
    accent: "from-red-500 to-rose-400",
    href: "/categories/heart-care",
  },
  {
    name: "Immunity Boosters",
    description: "Daily immune support",
    accent: "from-sky-500 to-cyan-400",
    href: "/categories/immunity-boosters",
  },
  {
    name: "Pain Relief",
    description: "Fast comfort options",
    accent: "from-amber-500 to-orange-400",
    href: "/categories/pain-relief",
  },
  {
    name: "Vitamins & Supplements",
    description: "Daily wellness essentials",
    accent: "from-violet-500 to-fuchsia-400",
    href: "/categories/vitamins-supplements",
  },
  {
    name: "Digestive Care",
    description: "Gut health favorites",
    accent: "from-teal-500 to-cyan-400",
    href: "/categories/digestive-care",
  },
  {
    name: "Skin Care",
    description: "Dermatology essentials",
    accent: "from-pink-500 to-rose-400",
    href: "/categories/skin-care",
  },
  {
    name: "Women's Health",
    description: "Tailored wellness",
    accent: "from-rose-500 to-pink-400",
    href: "/categories/womens-health",
  },
  {
    name: "Baby Care",
    description: "Gentle baby essentials",
    accent: "from-sky-400 to-blue-500",
    href: "/categories/baby-care",
  },
  {
    name: "Personal Care",
    description: "Everyday hygiene",
    accent: "from-purple-500 to-indigo-400",
    href: "/categories/personal-care",
  },
  {
    name: "Ayurvedic Products",
    description: "Natural remedies",
    accent: "from-[#009e76] to-[#00b386]",
    href: "/categories/ayurvedic",
  },
  {
    name: "Medical Devices",
    description: "Reliable equipment",
    accent: "from-slate-500 to-gray-400",
    href: "/categories/medical-devices",
  },
];

export const categoryPills: CategoryPill[] = [
  { name: "Diabetes Care" },
  { name: "Heart Care" },
  { name: "Immunity Boosters" },
  { name: "Pain Relief" },
  { name: "Vitamins & Supplements" },
  { name: "Digestive Care" },
  { name: "Skin Care" },
];

export const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Refill due soon",
    message: "Your Metformin pack is ready for a refill in 2 days.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Delivery update",
    message: "Your vitamin order has left the pharmacy and is on the way.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    title: "Subscription renewed",
    message: "Your wellness subscription was renewed successfully.",
    time: "Yesterday",
    unread: false,
  },
];

export const moneySavedSummary: MoneySavedSummary = {
  amount: "Coming Soon",
  comparison: "Savings will appear once pricing comparison data becomes available.",
  percentage: "N/A",
};

export const todayReminder: ReminderInfo = {
  medicine: "Take Metformin 500mg",
  time: "8:00 AM",
};
