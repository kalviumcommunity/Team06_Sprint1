# Order Details Modal - Complete Integration Guide

## Overview

This is a production-ready Order Details Modal system for the PharmEasy subscription platform. It includes fully reusable components, TypeScript types, and is designed for seamless backend integration with Prisma and PostgreSQL.

## File Structure

```
components/orders/
├── OrderDetailsModal.tsx          # Main modal component
├── OrderCard.tsx                  # Individual order card
├── OrderItemsCard.tsx             # Items display sub-component
├── TrackingTimeline.tsx           # Tracking status timeline
├── StatusBadge.tsx                # Status badge component
├── DownloadInvoiceButton.tsx      # Invoice download button
└── OrderListWithModal.tsx         # Integration component

lib/types/
└── order.ts                       # TypeScript interfaces and types

app/orders/
└── page.tsx                       # Example implementation page
```

## Components

### 1. OrderDetailsModal

**Main modal component that orchestrates all other components.**

```typescript
<OrderDetailsModal
  order={selectedOrder}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  isLoading={isLoading}
  error={error}
  onRetry={handleRetry}
/>
```

**Features:**
- Smooth fade-in animation with scale effect
- Escape key support to close
- Click outside to close
- Prevents background scrolling
- Full responsiveness (mobile, tablet, desktop)
- Sticky header with title and close button
- Loading spinner
- Error state with retry button
- Scrollable content area

### 2. OrderCard

**Displays a single order in card format with View Details button.**

```typescript
<OrderCard 
  order={order} 
  onViewDetails={handleViewDetails}
/>
```

**Features:**
- Clean card layout with shadow
- Order number and date
- Item count and total amount
- Status badge
- View Details button with hover effect

### 3. OrderItemsCard

**Displays items in the order with quantities and total.**

**Features:**
- List of medicines with dosage and quantity
- Total amount calculation
- Responsive layout
- Clean divider

### 4. TrackingTimeline

**Shows order status progression with visual timeline.**

```typescript
<TrackingTimeline
  trackingNumber="TRK4829201"
  currentStatus="delivered"
  steps={[...]}
/>
```

**Features:**
- Visual step indicators (1, 2, 3, 4)
- Checkmark for completed steps
- Color-coded status (green for completed, pending for future)
- Connected lines between steps
- Tracking number display

### 5. StatusBadge

**Displays status with color coding.**

```typescript
<StatusBadge status="delivered" size="md" />
```

**Sizes:** `sm` | `md` | `lg`

**Status Colors:**
- `delivered` → Green
- `processing` → Blue
- `shipped` → Orange
- `pending` → Gray
- `cancelled` → Red

### 6. DownloadInvoiceButton

**Trigger for invoice download with loading state.**

```typescript
<DownloadInvoiceButton
  orderId={order.id}
  isLoading={isLoading}
  onClick={handleDownloadInvoice}
/>
```

### 7. OrderListWithModal

**Integration component combining OrderCard and OrderDetailsModal.**

```typescript
<OrderListWithModal orders={orders} />
```

Manages:
- Modal open/close state
- Selected order state
- Loading and error states
- Retry logic

## TypeScript Types

All types are defined in `lib/types/order.ts`:

```typescript
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

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
```

## Backend Integration

### Step 1: Update Order API Route

Create `/pages/api/orders/[id].ts`:

```typescript
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;

  try {
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: {
        items: true,
        tracking: true,
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
}
```

### Step 2: Implement Invoice Download

Create `/pages/api/orders/[id]/invoice.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { generatePDF } from '@/lib/invoice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id } = req.query;

  try {
    const order = await prisma.order.findUnique({
      where: { id: String(id) },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const pdf = await generatePDF(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
}
```

### Step 3: Uncomment Backend Call in Modal

In `OrderDetailsModal.tsx`, uncomment the API call:

```typescript
async function handleDownloadInvoice(orderId: string): Promise<void> {
  try {
    const response = await fetch(`/api/orders/${orderId}/invoice`, {
      method: 'GET',
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download invoice:', error);
    alert('Failed to download invoice. Please try again.');
  }
}
```

## Usage Example

### In Your Orders Page

```typescript
'use client';

import { Order } from '@/lib/types/order';
import OrderListWithModal from '@/components/orders/OrderListWithModal';

export default function OrdersPage() {
  // Fetch orders from API
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <OrderListWithModal orders={orders} />
      </div>
    </div>
  );
}
```

## Features Implemented

✅ Modal with smooth animations
✅ Escape key support
✅ Click outside to close
✅ Background scroll prevention
✅ Loading spinner
✅ Error state with retry
✅ Responsive design (mobile, tablet, desktop)
✅ Order information display
✅ Items list with quantities
✅ Tracking timeline
✅ Status badges
✅ Invoice download button
✅ Full TypeScript support
✅ No `any` types
✅ Production-ready code
✅ Modular component structure
✅ Ready for backend integration

## Styling

All components use **Tailwind CSS** exclusively:
- Rounded corners
- Soft shadows
- Consistent spacing
- Responsive layout
- Hover and active states
- Smooth transitions

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states
- Color contrast compliant

## Performance

- Client-side components (`'use client'` directive)
- Memoized callbacks
- Efficient re-renders
- No unnecessary DOM operations
- Lazy loading ready

## Next Steps

1. Set up Prisma schema for orders
2. Create database migrations
3. Implement API routes
4. Connect to real data
5. Test with actual backend
6. Deploy to production

---

**Ready to connect with your backend!**
