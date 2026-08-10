import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/getAuthUserId';

export async function GET() {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const formattedOrders = orders.map((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });

      const medicinesList = order.items.map(
        (item) => `${item.medicineName}${item.quantity > 1 ? ` (Qty: ${item.quantity})` : ''}`
      );

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: dateStr,
        orderDate: order.createdAt.toISOString(),
        status: order.status,
        price: order.totalAmount,
        totalAmount: order.totalAmount,
        address: order.deliveryAddress,
        deliveryAddress: order.deliveryAddress,
        trackingId: order.trackingId,
        medicines: medicinesList,
        items: order.items,
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders from database' },
      { status: 500 }
    );
  }
}
