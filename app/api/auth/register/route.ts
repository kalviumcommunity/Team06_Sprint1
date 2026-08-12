import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const dob = body.dob;
    const gender = body.gender?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const place = body.place?.trim();
    const password = body.password;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !email ||
      !phone ||
      !place ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Validate date
    const dobDate = new Date(dob);

    if (isNaN(dobDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date of birth.",
        },
        { status: 400 }
      );
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        dob: dobDate,
        gender,
        email,
        phone,
        place,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("========== REGISTER ERROR ==========");
    console.error(error);
    console.error("====================================");

    // Prisma duplicate key
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Prisma DB connection error
    if (
      error instanceof Prisma.PrismaClientInitializationError
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}