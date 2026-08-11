import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Env-based admin account is not stored in the database
    if (session.user.role === "ADMIN" && session.user.id === "admin") {
      return NextResponse.json({
        success: true,
        user: {
          id: "admin",
          firstName: "Admin",
          lastName: "User",
          email: session.user.email ?? "",
          phone: "N/A",
          dob: new Date("1990-01-01").toISOString(),
          gender: "Other",
          place: "N/A",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        place: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "ADMIN" && session.user.id === "admin") {
      return NextResponse.json(
        { message: "Admin profile is managed via environment configuration" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, phone, dob, gender, place } = body;

    // Prevent role escalation — never accept role from body
    const updateData: Record<string, unknown> = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (gender !== undefined) updateData.gender = gender.trim();
    if (place !== undefined) updateData.place = place.trim();
    if (dob !== undefined) {
      const parsed = new Date(dob);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ message: "Invalid date of birth" }, { status: 400 });
      }
      updateData.dob = parsed;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        place: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
