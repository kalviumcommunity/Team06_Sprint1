import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  try {
    // Note: Future authentication integration goes here.
    // e.g., const session = await getSession();
    // const userId = session?.user?.id;
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const result = await prisma.notification.updateMany({
      where: {
        isRead: false,
        // userId, // Add userId check when auth is available
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      data: { count: result.count },
    });
  } catch (error) {
    console.error("Error updating all notifications:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
