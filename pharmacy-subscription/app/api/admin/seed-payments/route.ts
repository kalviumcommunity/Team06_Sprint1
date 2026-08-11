import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/seed-payments
 * Creates sample payment records for all existing orders that have no payment yet.
 * Used only for initial demo setup. Safe to call multiple times (idempotent per order).
 */
export async function POST(_request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        payments: { select: { id: true } },
        user: { select: { id: true } },
      },
    });

    const methodOptions = ['UPI', 'Card', 'Wallet', 'Net Banking'];
    const statusMap: Record<string, string> = {
      Delivered: 'SUCCESS',
      Shipped: 'SUCCESS',
      Processing: 'PENDING',
      Pending: 'PENDING',
      Cancelled: 'FAILED',
    };

    let created = 0;
    for (const order of orders) {
      if (order.payments.length > 0) continue; // already has payment
      const status = statusMap[order.status] ?? 'PENDING';
      const method = methodOptions[Math.floor(Math.random() * methodOptions.length)];
      await prisma.payment.create({
        data: {
          userId: order.user.id,
          orderId: order.id,
          amount: order.totalAmount,
          method,
          status,
          retryCount: status === 'FAILED' ? 1 : 0,
          createdAt: order.createdAt,
        },
      });
      created++;
    }

    return NextResponse.json({ message: `Created ${created} payment records for existing orders.` });
  } catch (error) {
    console.error('Error seeding payments:', error);
    return NextResponse.json({ error: 'Failed to seed payments' }, { status: 500 });
  }
}
