import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/getAuthUserId';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // userId filter enforces that users can only fetch their own orders
    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [{ id }, { orderNumber: id }],
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const medicinesList = order.items.map(
      (item) => `${item.medicineName}${item.quantity > 1 ? ` (Qty: ${item.quantity})` : ''}`
    );

    const orderDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      date: dateStr,
      orderDate: order.createdAt.toISOString(),
      status: order.status,
      price: order.totalAmount,
      totalAmount: order.totalAmount,
      address: order.deliveryAddress,
      deliveryAddress: order.deliveryAddress,
      trackingId: order.trackingId || `TRK-${order.orderNumber}`,
      medicines: medicinesList,
      items: order.items.map((item) => ({
        id: item.id,
        medicineName: item.medicineName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        price: item.unitPrice * item.quantity,
      })),
      createdAt: order.createdAt,
    };

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
