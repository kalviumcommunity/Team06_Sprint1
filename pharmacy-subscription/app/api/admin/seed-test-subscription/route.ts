import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Reads the same env var as the payment APIs — 1 min in dev, 45 min in prod
const RETRY_DELAY_MS = Number(process.env.PAYMENT_RETRY_DELAY_MS) || 45 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetStatus = (searchParams.get('status') || 'FAILED').toUpperCase();

    const userId = 'usr_demo_101';

    // Ensure the demo user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Demo user not found. Run the seed first.' },
        { status: 404 },
      );
    }

    // Ensure the demo subscription exists (or create it)
    const subscription = await prisma.subscription.upsert({
      where: { id: 'sub_monthly_001' },
      update: {},
      create: { id: 'sub_monthly_001', userId, status: 'active' },
    });

    // Find a medicine to attach (use any existing one)
    const medicine = await prisma.medicine.findFirst();
    if (!medicine) {
      return NextResponse.json(
        { error: 'No medicines found. Run the seed first.' },
        { status: 404 },
      );
    }

    // Generate a unique order number based on timestamp
    const suffix = Date.now().toString().slice(-6);
    const orderNumber = `ORD-TEST-${suffix}`;

    // Create a fresh Processing order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subscriptionId: subscription.id,
        status: 'Processing',
        totalAmount: 249,
        deliveryAddress: '42 MG Road, Bengaluru - 560001',
        trackingId: `TRK-TEST-${suffix}`,
        items: {
          create: [
            {
              medicineId: medicine.id,
              medicineName: `${medicine.name} ×30 (Test)`,
              quantity: 1,
              unitPrice: 249,
            },
          ],
        },
      },
    });

    // Clear any previous PENDING or FAILED payments for this user so
    // the payment form shows a clean state
    await prisma.payment.deleteMany({
      where: { userId, status: { in: ['PENDING', 'FAILED', 'RETRYING'] } },
    });

    const now = new Date();
    const isFailed = targetStatus === 'FAILED';
    const paymentFailedAt = isFailed ? now : null;
    const retryAvailableAt = isFailed ? new Date(now.getTime() + RETRY_DELAY_MS) : null;

    const payment = await prisma.payment.create({
      data: {
        userId,
        orderId: order.id,
        amount: 249,
        method: 'UPI',
        status: isFailed ? 'FAILED' : 'PENDING',
        retryCount: isFailed ? 1 : 0,
        paymentFailedAt,
        retryAvailableAt,
      },
    });

    const retryDelayMinutes = Math.round(RETRY_DELAY_MS / 60000);
    const retryAt = retryAvailableAt
      ? retryAvailableAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : null;

    return NextResponse.json({
      message: `✅ Test ${payment.status} payment created.`,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        amount: order.totalAmount,
      },
      payment: {
        id: payment.id,
        status: payment.status,
        paymentFailedAt: paymentFailedAt ? paymentFailedAt.toISOString() : null,
        retryAvailableAt: retryAvailableAt ? retryAvailableAt.toISOString() : null,
      },
      testing: {
        retryDelayMs: RETRY_DELAY_MS,
        retryDelayMinutes,
        retryUnlocksAt: retryAt,
        note: isFailed
          ? `Go to /payments — you will see the countdown timer. After ${retryDelayMinutes} min, "Retry Payment" button will appear.`
          : `Go to /payments — you will see the active Pay Now form.`,
      },
    });
  } catch (error) {
    console.error('Error creating test subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create test subscription', detail: String(error) },
      { status: 500 },
    );
  }
}
