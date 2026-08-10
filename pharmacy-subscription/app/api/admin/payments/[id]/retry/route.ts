import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/services/notificationService';
import { getAuthenticatedUserId } from '@/lib/getAuthUserId';

const MAX_RETRIES = 3;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, orderNumber: true } },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Ensure the payment belongs to the authenticated user
    if (payment.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (payment.status !== 'FAILED' && payment.status !== 'RETRYING') {
      return NextResponse.json(
        { error: 'Only FAILED or RETRYING payments can be retried' },
        { status: 400 }
      );
    }

    if (payment.retryCount >= MAX_RETRIES) {
      return NextResponse.json(
        { error: `Maximum retry limit (${MAX_RETRIES}) reached` },
        { status: 400 }
      );
    }

    // ── Backend authority: check retryAvailableAt from DB ────────────────────
    // retryAvailableAt is set to paymentFailedAt + 45 minutes when payment fails.
    // This check is authoritative — the frontend countdown is only a display aid.
    if (!payment.retryAvailableAt) {
      return NextResponse.json(
        { error: 'Retry time not set for this payment' },
        { status: 400 }
      );
    }

    if (new Date() < payment.retryAvailableAt) {
      const remaining = Math.ceil(
        (payment.retryAvailableAt.getTime() - Date.now()) / 1000 / 60
      );
      return NextResponse.json(
        { error: `Retry not available yet. Please wait ${remaining} more minute(s).` },
        { status: 400 }
      );
    }

    // Mark as RETRYING and increment count
    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status: 'RETRYING',
        retryCount: { increment: 1 },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, orderNumber: true } },
      },
    });

    const orderRef = updated.order?.orderNumber ?? 'your payment';

    await createNotification({
      userId: updated.userId,
      type: 'PAYMENT',
      title: 'Payment Retry Initiated',
      message: `A retry has been initiated for ${orderRef}. We will notify you once the payment is processed.`,
      orderId: updated.order?.id ?? null,
      paymentId: updated.id,
    });

    // Simulate async payment processing (3 seconds for demo)
    setTimeout(async () => {
      try {
        const isSuccess = Math.random() < 0.65;
        const finalStatus = isSuccess ? 'SUCCESS' : 'FAILED';
        const now = new Date();

        await prisma.payment.update({
          where: { id },
          data: {
            status: finalStatus,
            // On retry failure, set a new 45-min window
            paymentFailedAt: isSuccess ? null : now,
            retryAvailableAt: isSuccess ? null : new Date(now.getTime() + 45 * 60 * 1000),
          },
        });

        await createNotification({
          userId: updated.userId,
          type: 'PAYMENT',
          title: isSuccess ? 'Payment Retry Successful' : 'Payment Retry Failed',
          message: isSuccess
            ? `Payment retry for ${orderRef} was successful.`
            : `Payment retry for ${orderRef} failed again. A new 45-minute window has started.`,
          orderId: updated.order?.id ?? null,
          paymentId: id,
        });
      } catch (e) {
        console.error('Background retry settlement error:', e);
      }
    }, 3000);

    return NextResponse.json({
      message: 'Payment retry initiated',
      payment: {
        id: updated.id,
        status: updated.status,
        retryCount: updated.retryCount,
        userName: updated.user.name,
        orderNumber: updated.order?.orderNumber ?? null,
      },
    });
  } catch (error) {
    console.error('Error retrying payment:', error);
    return NextResponse.json({ error: 'Failed to retry payment' }, { status: 500 });
  }
}
