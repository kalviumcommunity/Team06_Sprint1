import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let user = await prisma.user.findFirst({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "User",
          email: "user@example.com",
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          address: true,
          role: true,
          createdAt: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, gender, dateOfBirth, address } = body;

    let user = await prisma.user.findFirst({
      where: { role: "USER" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name?.trim() || "User",
          email: email?.trim() || "user@example.com",
          role: "USER",
          phone: phone?.trim() || null,
          gender: gender?.trim() || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          address: address?.trim() || null,
        },
      });
    } else {
      const updateData: Record<string, unknown> = {};

      if (typeof name === "string" && name.trim()) {
        updateData.name = name.trim();
      }
      if (typeof email === "string" && email.trim()) {
        updateData.email = email.trim();
      }
      if (phone !== undefined) {
        updateData.phone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
      }
      if (gender !== undefined) {
        updateData.gender = typeof gender === "string" && gender.trim() ? gender.trim() : null;
      }
      if (dateOfBirth !== undefined) {
        updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
      }
      if (address !== undefined) {
        updateData.address = typeof address === "string" && address.trim() ? address.trim() : null;
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
