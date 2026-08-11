import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function calcNextRefill(frequency: string, startDate: Date): Date {
  const d = new Date(startDate);
  if (frequency === "DAILY") d.setDate(d.getDate() + 1);
  else if (frequency === "WEEKLY") d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 30); // MONTHLY default
  return d;
}

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
    const { medicineId, frequency, quantity, startDate, nextRefill, status } = body;

    // Verify subscription exists
    const existing = await prisma.subscription.findUnique({
      where: { id },
      include: { medicine: true },
    });
    if (!existing) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Validate medicineId
    if (medicineId !== undefined) {
      const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
      if (!med) {
        return NextResponse.json({ message: "Selected medicine not found" }, { status: 400 });
      }
      updateData.medicineId = medicineId;
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

    // Validate startDate
    if (startDate !== undefined) {
      const parsedStart = new Date(startDate);
      if (isNaN(parsedStart.getTime())) {
        return NextResponse.json({ message: "Invalid startDate" }, { status: 400 });
      }
      updateData.startDate = parsedStart;
    }

    // Recalculate nextRefill if frequency or startDate changes
    if (frequency !== undefined || startDate !== undefined) {
      const freq = frequency !== undefined ? frequency : existing.frequency;
      const start = startDate !== undefined ? new Date(startDate) : new Date(existing.startDate);
      updateData.nextRefill = calcNextRefill(freq, start);
    } else if (nextRefill !== undefined) {
      // Allow explicit nextRefill override if frequency or startDate are not being changed
      const parsedRefill = new Date(nextRefill);
      if (isNaN(parsedRefill.getTime())) {
        return NextResponse.json({ message: "Invalid nextRefill date" }, { status: 400 });
      }
      updateData.nextRefill = parsedRefill;
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        medicine: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("PATCH /api/admin/subscriptions/[id] error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
