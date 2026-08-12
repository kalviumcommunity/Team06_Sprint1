import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) {
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, medicine });
  } catch (error) {
    console.error("GET /api/medicines/[id] error:", error);
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, manufacturer, price, stock, dosage, manufacturingDate, expiryDate } = body;

    const existing = await prisma.medicine.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
    }

    const mfgDate = manufacturingDate ? new Date(manufacturingDate) : existing.manufacturingDate;
    const expDate = expiryDate ? new Date(expiryDate) : existing.expiryDate;
    if (mfgDate && expDate && expDate <= mfgDate) {
      return NextResponse.json({ message: "Expiry date must be after manufacturing date" }, { status: 400 });
    }

    const updated = await prisma.medicine.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(manufacturer !== undefined && { manufacturer: manufacturer.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(dosage !== undefined && { dosage: dosage?.trim() || null }),
        ...(manufacturingDate !== undefined && { manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
      },
    });

    return NextResponse.json({ success: true, medicine: updated });
  } catch (error) {
    console.error("PATCH /api/medicines/[id] error:", error);
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.medicine.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
    }

    await prisma.medicine.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Medicine deleted" });
  } catch (error) {
    console.error("DELETE /api/medicines/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
