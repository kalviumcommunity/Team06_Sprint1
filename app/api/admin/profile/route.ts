import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          role: "ADMIN",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    let admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: name?.trim() || "Admin",
          email: email?.trim() || "admin@example.com",
          role: "ADMIN",
        },
      });
    } else {
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          name: typeof name === "string" && name.trim() ? name.trim() : admin.name,
          email: typeof email === "string" && email.trim() ? email.trim() : admin.email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
