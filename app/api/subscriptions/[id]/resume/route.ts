import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function calcNextRefill(frequency: string): Date {
  const d = new Date();
  if (frequency === "DAILY") d.setDate(d.getDate() + 1);
  else if (frequency === "WEEKLY") d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 30);
  return d;
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.subscription.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const nextRefill = calcNextRefill(existing.frequency);

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: "ACTIVE", nextRefill },
      include: { medicine: true },
    });

    // Create resume notification after successful resume
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        title: "Subscription Resumed",
        message: `Your subscription for ${updated.medicine.name} has been resumed successfully.`,
        type: "GENERAL",
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("PATCH /api/subscriptions/[id]/resume error:", error);
    return NextResponse.json({ message: "Failed to resume subscription" }, { status: 500 });
  }
}
