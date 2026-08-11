import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const refill = await prisma.subscription.findUnique({
      where: { id },
      include: { medicine: true },
    });

    if (!refill) {
      return NextResponse.json({ message: "Refill schedule not found" }, { status: 404 });
    }
    if (refill.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, refill });
  } catch (error) {
    console.error("GET /api/refills/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
