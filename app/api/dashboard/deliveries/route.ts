import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { date: "asc" },
    });
    
    return NextResponse.json({
      success: true,
      data: deliveries || [],
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
