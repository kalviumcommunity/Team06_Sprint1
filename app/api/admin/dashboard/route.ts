import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, totalOrders, totalSubscriptions, recentUsers] = await Promise.all([
      prisma.user.count({
        where: { role: "USER" },
      }),
      prisma.order.count(),
      prisma.subscription.count(),
      prisma.user.findMany({
        where: { role: "USER" },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    const failedPayments = 0; // Payment model does not exist in schema

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalSubscriptions,
        failedPayments,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
