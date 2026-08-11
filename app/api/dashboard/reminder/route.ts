import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reminder = await prisma.reminder.findFirst({
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({
      success: true,
      data: reminder || null,
    });
  } catch (error) {
    console.error("Error fetching reminder:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
