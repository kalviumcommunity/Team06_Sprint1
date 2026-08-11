import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/services/notificationService';

const VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_MESSAGES: Record<string, { title: string; message: (orderNum: string) => string }> = {
  Pending:    { title: 'Order Pending',    message: (n) => `Order ${n} is awaiting confirmation.` },
  Processing: { title: 'Order Confirmed',  message: (n) => `Order ${n} has been confirmed and is now being processed.` },
  Shipped:    { title: 'Order Shipped',    message: (n) => `Order ${n} has been shipped and is on the way!` },
  Delivered:  { title: 'Order Delivered',  message: (n) => `Order ${n} has been delivered successfully.` },
  Cancelled:  { title: 'Order Cancelled',  message: (n) => `Order ${n} has been cancelled.` },
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { select: { id: true, medicineName: true, quantity: true, unitPrice: true } },
      },
    });


    // Create a persistent notification for the user
    const notifMeta = STATUS_MESSAGES[status];
    if (notifMeta) {
      await createNotification({
        userId: updated.userId,
        type: 'ORDER',
        title: notifMeta.title,
        message: notifMeta.message(updated.orderNumber),
        orderId: updated.id,
      });
    }

    return NextResponse.json({
      message: `Order status updated to ${status}`,
      order: {
        id: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
        userName: updated.user.name,
        userEmail: updated.user.email,
        totalAmount: updated.totalAmount,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
