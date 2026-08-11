import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { nextRefill, quantity, frequency, status } = body;

    // Verify subscription/refill exists
    const existing = await prisma.subscription.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ message: "Refill/Subscription not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Validate nextRefill date
    if (nextRefill !== undefined) {
      const parsedRefill = new Date(nextRefill);
      if (isNaN(parsedRefill.getTime())) {
        return NextResponse.json({ message: "Invalid scheduled/nextRefill date" }, { status: 400 });
      }
      updateData.nextRefill = parsedRefill;
    }

    // Validate quantity
    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        return NextResponse.json({ message: "Quantity must be a positive integer" }, { status: 400 });
      }
      updateData.quantity = qty;
    }

    // Validate frequency
    if (frequency !== undefined) {
      const validFreqs = ["DAILY", "WEEKLY", "MONTHLY"];
      if (!validFreqs.includes(frequency)) {
        return NextResponse.json({ message: "Frequency must be DAILY, WEEKLY, or MONTHLY" }, { status: 400 });
      }
      updateData.frequency = frequency;
    }

    // Validate status
    if (status !== undefined) {
      const validStatuses = ["ACTIVE", "PAUSED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ message: "Status must be ACTIVE, PAUSED, or CANCELLED" }, { status: 400 });
      }
      updateData.status = status;
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        medicine: { select: { name: true, price: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("PATCH /api/admin/refills/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
