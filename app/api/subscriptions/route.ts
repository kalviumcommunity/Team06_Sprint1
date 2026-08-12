import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function calcNextRefill(frequency: string, startDate: Date): Date {
  const d = new Date(startDate);
  if (frequency === "DAILY") d.setDate(d.getDate() + 1);
  else if (frequency === "WEEKLY") d.setDate(d.getDate() + 7);
  else d.setDate(d.getDate() + 30); // MONTHLY default
  return d;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: { medicine: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    console.error("GET /api/subscriptions error:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscriptions" },
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

    const userId = session.user.id;
    const body = await req.json();
    const { medicineId, frequency, quantity, startDate, deliveryAddress, paymentMethod } = body;

    // Validate required fields
    if (!medicineId || !frequency || !quantity || !startDate) {
      return NextResponse.json(
        { message: "medicineId, frequency, quantity, and startDate are required" },
        { status: 400 }
      );
    }

    const validFrequencies = ["DAILY", "WEEKLY", "MONTHLY"];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { message: "frequency must be DAILY, WEEKLY, or MONTHLY" },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return NextResponse.json(
        { message: "quantity must be a positive integer" },
        { status: 400 }
      );
    }

    const parsedStart = new Date(startDate);
    if (isNaN(parsedStart.getTime())) {
      return NextResponse.json({ message: "Invalid startDate" }, { status: 400 });
    }

    // Check medicine exists and has stock
    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
    });
    if (!medicine) {
      return NextResponse.json({ message: "Medicine not found" }, { status: 404 });
    }
    if (medicine.stock <= 0) {
      return NextResponse.json(
        { message: "Medicine is out of stock" },
        { status: 400 }
      );
    }

    const nextRefill = calcNextRefill(frequency, parsedStart);

    // Fetch user details for default place if delivery address is not passed
    const userObj = await prisma.user.findUnique({
      where: { id: userId },
    });
    const finalAddress = deliveryAddress?.trim() || userObj?.place || "Standard Home Delivery";

    const subscription = await prisma.$transaction(async (tx) => {
      // 1. Create Subscription
      const sub = await tx.subscription.create({
        data: {
          userId,
          medicineId,
          frequency: frequency as any,
          quantity: qty,
          startDate: parsedStart,
          nextRefill,
          status: "ACTIVE",
        },
        include: { medicine: true },
      });

      // 2. Generate unique orderNumber
      const totalOrders = await tx.order.count();
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(totalOrders + 1).padStart(4, "0")}-${uniqueSuffix}`;

      // 3. Calculate total amount
      const totalAmount = sub.medicine.price * sub.quantity;

      // 4. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subscriptionId: sub.id,
          status: "PENDING",
          totalAmount,
          deliveryAddress: finalAddress,
          scheduledDate: parsedStart,
        },
      });

      // 5. Create OrderItem
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          medicineId: sub.medicineId,
          medicineName: sub.medicine.name,
          quantity: sub.quantity,
          unitPrice: sub.medicine.price,
        },
      });

      // 6. Create Payment
      const validMethods = ["CASH", "CARD", "UPI", "NET_BANKING"];
      const finalMethod = validMethods.includes(paymentMethod) ? paymentMethod : "CASH";

      await tx.payment.create({
        data: {
          orderId: order.id,
          userId,
          amount: totalAmount,
          method: finalMethod as any,
          status: "PENDING",
          retryCount: 0,
        },
      });

      // 7. Create Success Notification
      await tx.notification.create({
        data: {
          userId,
          title: "Subscription Created Successfully",
          message: `Your subscription for ${sub.medicine.name} has been created successfully.`,
          type: "SUBSCRIPTION_CREATED",
          isRead: false,
        },
      });

      // 8. Create Refill Notification
      const formatRefillDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };

      const refillDateStr = formatRefillDate(nextRefill);

      await tx.notification.create({
        data: {
          userId,
          title: "Upcoming Medicine Refill",
          message: `Your ${sub.medicine.name} refill is scheduled for ${refillDateStr}.`,
          type: "REFILL_REMINDER",
          isRead: false,
        },
      });

    }, {
      timeout: 25000
    });

    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (error) {
    console.error("POST /api/subscriptions error:", error);
    const rawMsg = error instanceof Error ? error.message : "Failed to create subscription";
    const msg = rawMsg.replace(/postgresql:\/\/.*@/g, "postgresql://****@");
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

