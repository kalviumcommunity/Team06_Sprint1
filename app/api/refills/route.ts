import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const refills = await prisma.subscription.findMany({
      where: { userId, status: "ACTIVE" },
      include: { medicine: true },
      orderBy: { nextRefill: "asc" },
    });

    return NextResponse.json({ success: true, refills });
  } catch (error) {
    console.error("GET /api/refills error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
