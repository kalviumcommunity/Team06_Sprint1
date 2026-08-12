import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: "PAUSED" },
      include: { medicine: true },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("PATCH /api/subscriptions/[id]/pause error:", error);
    return NextResponse.json({ message: "Failed to pause subscription" }, { status: 500 });
  }
}
