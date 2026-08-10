import { prisma } from '@/lib/prisma';

export async function createNotification({
  userId,
  type,
  title,
  message,
  orderId,
  paymentId,
}: {
  userId: string;
  type: 'ORDER' | 'PAYMENT';
  title: string;
  message: string;
  orderId?: string | null;
  paymentId?: string | null;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        orderId: orderId || null,
        paymentId: paymentId || null,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
