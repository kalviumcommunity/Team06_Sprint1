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

    const [
      totalUsers,
      totalMedicines,
      totalSubscriptions,
      activeSubscriptions,
      pausedSubscriptions,
      cancelledSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.medicine.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "PAUSED" } }),
      prisma.subscription.count({ where: { status: "CANCELLED" } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalMedicines,
        totalSubscriptions,
        activeSubscriptions,
        pausedSubscriptions,
        cancelledSubscriptions,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
