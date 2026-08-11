import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Note: Future authentication integration goes here.
    // e.g., const session = await getSession();
    // const userId = session?.user?.id;
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const notification = await prisma.notification.update({
      where: { 
        id,
        // userId, // Add userId check when auth is available
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(`Error updating notification:`, error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
