import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  darkMode: false,
  medicineRefillReminders: true,
  orderUpdates: true,
  paymentAlerts: true,
  promotionalNotifications: false,
};

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { role: "USER" },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SETTINGS,
      });
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        darkMode: settings.darkMode,
        medicineRefillReminders: settings.medicineRefillReminders,
        orderUpdates: settings.orderUpdates,
        paymentAlerts: settings.paymentAlerts,
        promotionalNotifications: settings.promotionalNotifications,
      },
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    let user = await prisma.user.findFirst({
      where: { role: "USER" },
    });

    // Auto-create user if missing in database
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "User",
          email: "user@example.com",
          role: "USER",
        },
      });
    }

    const settingsData = {
      darkMode: typeof body.darkMode === "boolean" ? body.darkMode : DEFAULT_SETTINGS.darkMode,
      medicineRefillReminders: typeof body.medicineRefillReminders === "boolean" ? body.medicineRefillReminders : DEFAULT_SETTINGS.medicineRefillReminders,
      orderUpdates: typeof body.orderUpdates === "boolean" ? body.orderUpdates : DEFAULT_SETTINGS.orderUpdates,
      paymentAlerts: typeof body.paymentAlerts === "boolean" ? body.paymentAlerts : DEFAULT_SETTINGS.paymentAlerts,
      promotionalNotifications: typeof body.promotionalNotifications === "boolean" ? body.promotionalNotifications : DEFAULT_SETTINGS.promotionalNotifications,
    };

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: settingsData,
      create: {
        userId: user.id,
        ...settingsData,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        darkMode: updatedSettings.darkMode,
        medicineRefillReminders: updatedSettings.medicineRefillReminders,
        orderUpdates: updatedSettings.orderUpdates,
        paymentAlerts: updatedSettings.paymentAlerts,
        promotionalNotifications: updatedSettings.promotionalNotifications,
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
