import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const medicines = await prisma.medicine.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { manufacturer: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, medicines });
  } catch (error) {
    console.error("GET /api/medicines error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch medicines" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, manufacturer, price, stock, dosage, manufacturingDate, expiryDate } = body;

    if (!name || !manufacturer || price === undefined || stock === undefined) {
      return NextResponse.json(
        { message: "name, manufacturer, price, and stock are required" },
        { status: 400 }
      );
    }
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json({ message: "Invalid price" }, { status: 400 });
    }
    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json({ message: "Invalid stock" }, { status: 400 });
    }
    if (manufacturingDate && expiryDate) {
      const mfg = new Date(manufacturingDate);
      const exp = new Date(expiryDate);
      if (exp <= mfg) {
        return NextResponse.json({ message: "Expiry date must be after manufacturing date" }, { status: 400 });
      }
    }

    const medicine = await prisma.medicine.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        manufacturer: manufacturer.trim(),
        price: Number(price),
        stock: Number(stock),
        dosage: dosage?.trim() || null,
        manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return NextResponse.json({ success: true, medicine }, { status: 201 });
  } catch (error) {
    console.error("POST /api/medicines error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create medicine" },
      { status: 500 }
    );
  }
}
