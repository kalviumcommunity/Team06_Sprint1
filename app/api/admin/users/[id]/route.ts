import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: true,
        orders: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Basic Information
    const basicInfo = {
      fullName: user.name || null,
      email: user.email || null,
      phone: user.phone || null,
      gender: user.gender || null,
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
      address: user.address || null,
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
    };

    // Subscription Information
    const activeSubs = user.subscriptions.filter(
      (s) => (s.status || "").toLowerCase() === "active"
    );
    const subscriptionInfo = {
      activeSubscriptionsCount: activeSubs.length,
      totalSubscriptionsCount: user.subscriptions.length,
    };

    // Order Information
    const completedOrders = user.orders.filter((o) =>
      ["delivered", "completed"].includes((o.status || "").toLowerCase())
    );
    const pendingOrders = user.orders.filter((o) =>
      ["pending", "processing", "out for delivery", "in transit", "scheduled"].includes(
        (o.status || "").toLowerCase()
      )
    );
    const orderInfo = {
      totalOrders: user.orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
    };

    // Payment Information
    const successfulPayments = user.orders.filter((o) =>
      ["delivered", "completed", "successful", "paid"].includes(
        (o.status || "").toLowerCase()
      )
    );
    const failedPayments = user.orders.filter((o) =>
      ["failed", "cancelled", "declined"].includes(
        (o.status || "").toLowerCase()
      )
    );

    const totalAmount = user.orders.reduce((sum, o) => sum + (o.amount || 0), 0);

    const paymentInfo = {
      totalPayments: user.orders.length,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      totalAmountSpent: `₹${totalAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        basicInfo,
        subscriptionInfo,
        orderInfo,
        paymentInfo,
      },
    });
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}
