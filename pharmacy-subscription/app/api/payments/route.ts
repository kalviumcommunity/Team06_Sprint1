import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/services/notificationService';
import { getAuthenticatedUserId } from '@/lib/getAuthUserId';

// ── Retry delay: configurable via env var for dev/testing ──────────────────
// Set PAYMENT_RETRY_DELAY_MS=60000 in .env for a 1-minute dev timer.
// Omit (or set to 2700000) in production to keep the 45-minute window.
const RETRY_DELAY_MS = Number(process.env.PAYMENT_RETRY_DELAY_MS) || 45 * 60 * 1000;

export async function GET() {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        order: { select: { orderNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = payments.map((p) => {
      const cleanId = p.id.replace(/-/g, '').toUpperCase();
      const paymentId = `PAY-${cleanId.slice(0, 4)}`;
      const transactionId = `TXN-${cleanId.slice(4, 12)}`;

      const dateStr = p.createdAt.toLocaleDateString('en-IN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });

      return {
        id: p.id,
        paymentId,
        transactionId,
        status: p.status.toLowerCase(),
        orderId: p.order?.orderNumber || 'Subscription Renewal',
        method: p.method,
        date: dateStr,
        amount: p.amount,
        rawDate: p.createdAt.toISOString(),
        // Dedicated retry timing fields — persisted in DB
        paymentFailedAt: p.paymentFailedAt?.toISOString() ?? null,
        retryAvailableAt: p.retryAvailableAt?.toISOString() ?? null,
        failureReason: p.status === 'FAILED' ? 'Transaction declined by bank' : undefined,
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const body = await request.json();
    const { method, orderId, amount } = body;

    let dbOrderId: string | null = null;
    let displayOrderNumber = 'Subscription Renewal';

    if (orderId && orderId !== 'Subscription Renewal') {
      const order = await prisma.order.findFirst({
        where: {
          userId, // ensure the order belongs to this user
          OR: [{ id: orderId }, { orderNumber: orderId }],
        },
      });
      if (order) {
        dbOrderId = order.id;
        displayOrderNumber = order.orderNumber;
      }
    }

    // Support intentional dev/testing failure trigger via method containing "fail" or "failure" (case-insensitive)
    const isTestFailure = method && (method.toLowerCase().includes('fail') || method.toLowerCase().includes('failure'));
    const isTestSuccess = method && (method.toLowerCase().includes('success') || method.toLowerCase().includes('complete'));

    // Simulate payment result (70% success rate for demo)
    const isSuccess = isTestFailure ? false : isTestSuccess ? true : Math.random() < 0.7;
    const status = isSuccess ? 'SUCCESS' : 'FAILED';

    const now = new Date();
    const paymentFailedAt = isSuccess ? null : now;
    const retryAvailableAt = isSuccess ? null : new Date(now.getTime() + RETRY_DELAY_MS);

    const payment = await prisma.payment.create({
      data: {
        userId,
        orderId: dbOrderId,
        amount: amount || 249,
        method: method || 'UPI',
        status,
        retryCount: !isSuccess ? 1 : 0,
        paymentFailedAt,
        retryAvailableAt,
      },
    });

    const cleanId = payment.id.replace(/-/g, '').toUpperCase();
    const paymentId = `PAY-${cleanId.slice(0, 4)}`;
    const transactionId = `TXN-${cleanId.slice(4, 12)}`;

    await createNotification({
      userId,
      type: 'PAYMENT',
      title: isSuccess ? 'Payment Successful' : 'Payment Failed',
      message: isSuccess
        ? `Your subscription payment of ₹${payment.amount} for ${displayOrderNumber} was successful.`
        : `Your subscription payment of ₹${payment.amount} for ${displayOrderNumber} failed. You may retry after ${Math.round(RETRY_DELAY_MS / 60000)} minute(s).`,
      orderId: dbOrderId,
      paymentId: payment.id,
    });

    return NextResponse.json(
      {
        success: true,
        payment: {
          id: payment.id,
          paymentId,
          transactionId,
          status: payment.status,
          orderId: orderId || 'Subscription Renewal',
          method: payment.method,
          amount: payment.amount,
          createdAt: payment.createdAt.toISOString(),
          paymentFailedAt: payment.paymentFailedAt?.toISOString() ?? null,
          retryAvailableAt: payment.retryAvailableAt?.toISOString() ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
