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

    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        medicine: { select: { name: true, price: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    console.error("GET /api/admin/subscriptions error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
