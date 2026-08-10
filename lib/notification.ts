import { prisma } from "@/lib/prisma";

export interface CreateNotificationParams {
  userId?: string | null;
  title: string;
  message: string;
  type: string;
}

export async function createNotification({
  userId,
  title,
  message,
  type,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        ...(userId ? { userId } : {}),
      },
    });
    return { success: true, notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}
