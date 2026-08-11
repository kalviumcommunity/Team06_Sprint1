import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "Active" },
    });

    const upcomingDeliveries = await prisma.delivery.count({
      where: {
        status: { in: ["Processing", "Out for Delivery"] },
      },
    });

    const totalOrders = await prisma.order.count();

    return NextResponse.json({
      success: true,
      data: {
        activeSubscriptions: activeSubscriptions || 0,
        upcomingDeliveries: upcomingDeliveries || 0,
        totalOrders: totalOrders || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
