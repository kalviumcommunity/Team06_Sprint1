import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function calcNextRefill(frequency: string, fromDate: Date): Date {
  const d = new Date(fromDate);
  if (frequency === "DAILY") d.setDate(d.getDate() + 1);
  else if (frequency === "WEEKLY") d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 30);
  return d;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { medicine: true },
    });

    if (!subscription) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }
    if (subscription.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("GET /api/subscriptions/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
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

    const { id } = await params;
    const existing = await prisma.subscription.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { medicineId, frequency, quantity, startDate } = body;

    const validFrequencies = ["DAILY", "WEEKLY", "MONTHLY"];
    if (frequency && !validFrequencies.includes(frequency)) {
      return NextResponse.json({ message: "Invalid frequency" }, { status: 400 });
    }
    if (quantity !== undefined && (isNaN(Number(quantity)) || Number(quantity) < 1)) {
      return NextResponse.json({ message: "quantity must be a positive integer" }, { status: 400 });
    }

    // If a new medicineId is given, verify it exists
    if (medicineId) {
      const med = await prisma.medicine.findUnique({ where: { id: medicineId } });
      if (!med) {
        return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
      }
    }

    const newFreq = frequency || existing.frequency;
    const newStart = startDate ? new Date(startDate) : existing.startDate;
    const newNextRefill = (frequency || startDate) ? calcNextRefill(newFreq, newStart) : existing.nextRefill;

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        ...(medicineId && { medicineId }),
        ...(frequency && { frequency }),
        ...(quantity !== undefined && { quantity: Number(quantity) }),
        ...(startDate && { startDate: newStart }),
        nextRefill: newNextRefill,
      },
      include: { medicine: true },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("PATCH /api/subscriptions/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    const cancelled = await prisma.subscription.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, subscription: cancelled });
  } catch (error) {
    console.error("DELETE /api/subscriptions/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
