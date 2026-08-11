import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ADMIN_SETTINGS = {
  newUserRegistrationAlerts: true,
  subscriptionAlerts: true,
  failedPaymentAlerts: true,
  orderAlerts: true,
};

export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_ADMIN_SETTINGS,
      });
    }

    const settings = await prisma.adminSettings.findUnique({
      where: { userId: admin.id },
    });

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_ADMIN_SETTINGS,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        newUserRegistrationAlerts: settings.newUserRegistrationAlerts,
        subscriptionAlerts: settings.subscriptionAlerts,
        failedPaymentAlerts: settings.failedPaymentAlerts,
        orderAlerts: settings.orderAlerts,
      },
    });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    let admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          role: "ADMIN",
        },
      });
    }

    const settingsData = {
      newUserRegistrationAlerts:
        typeof body.newUserRegistrationAlerts === "boolean"
          ? body.newUserRegistrationAlerts
          : DEFAULT_ADMIN_SETTINGS.newUserRegistrationAlerts,
      subscriptionAlerts:
        typeof body.subscriptionAlerts === "boolean"
          ? body.subscriptionAlerts
          : DEFAULT_ADMIN_SETTINGS.subscriptionAlerts,
      failedPaymentAlerts:
        typeof body.failedPaymentAlerts === "boolean"
          ? body.failedPaymentAlerts
          : DEFAULT_ADMIN_SETTINGS.failedPaymentAlerts,
      orderAlerts:
        typeof body.orderAlerts === "boolean"
          ? body.orderAlerts
          : DEFAULT_ADMIN_SETTINGS.orderAlerts,
    };

    const updatedSettings = await prisma.adminSettings.upsert({
      where: { userId: admin.id },
      update: settingsData,
      create: {
        userId: admin.id,
        ...settingsData,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        newUserRegistrationAlerts: updatedSettings.newUserRegistrationAlerts,
        subscriptionAlerts: updatedSettings.subscriptionAlerts,
        failedPaymentAlerts: updatedSettings.failedPaymentAlerts,
        orderAlerts: updatedSettings.orderAlerts,
      },
    });
  } catch (error) {
    console.error("Error updating admin settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
