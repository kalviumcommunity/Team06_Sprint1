import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [medicines, lowStock] = await Promise.all([
      prisma.medicine.findMany({ orderBy: { name: "asc" } }),
      prisma.medicine.findMany({
        where: { stock: { lte: 10 } },
        orderBy: { stock: "asc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ success: true, medicines, lowStock });
  } catch (error) {
    console.error("GET /api/admin/medicines error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
