import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Clean up existing data to prevent duplicates
  await prisma.notification.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Seed User
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "hashed_password_placeholder",
    },
  });

  // Seed Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        medicine: "Atorvastatin 20mg",
        frequency: "Monthly",
        nextDelivery: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: "Active",
        userId: user.id,
      },
      {
        medicine: "Lisinopril 10mg",
        frequency: "Bi-Weekly",
        nextDelivery: new Date(new Date().setDate(new Date().getDate() + 14)),
        status: "Active",
        userId: user.id,
      },
    ],
  });

  // Seed Deliveries
  await prisma.delivery.createMany({
    data: [
      {
        name: "Vitamin D3 60k",
        quantity: "1 Box",
        date: new Date(),
        status: "Out for Delivery",
        userId: user.id,
      },
      {
        name: "Paracetamol 500mg",
        quantity: "2 Strips",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: "Processing",
        userId: user.id,
      },
    ],
  });

  // Seed Orders
  await prisma.order.createMany({
    data: [
      {
        orderNumber: "ORD-839210",
        medicine: "Metformin 500mg",
        amount: 25.5,
        status: "Delivered",
        deliveredDate: new Date(new Date().setDate(new Date().getDate() - 3)),
        userId: user.id,
      },
      {
        orderNumber: "ORD-930211",
        medicine: "Amoxicillin 250mg",
        amount: 15.0,
        status: "Processing",
        userId: user.id,
      },
    ],
  });

  // Seed Reminder
  await prisma.reminder.create({
    data: {
      medicine: "Atorvastatin 20mg",
      time: "08:00 AM",
      userId: user.id,
    },
  });

  // Seed Products
  await prisma.product.createMany({
    data: [
      {
        name: "Whey Protein Isolate 1kg",
        price: 45.99,
        originalPrice: 55.99,
        discount: "18% OFF",
        rating: 4.8,
        image: "/images/products/whey.png",
        tag: "Bestseller",
      },
      {
        name: "Multivitamin Complex 60s",
        price: 15.99,
        originalPrice: 19.99,
        discount: "20% OFF",
        rating: 4.5,
        image: "/images/products/multivitamin.png",
        tag: "Essential",
      },
    ],
  });

  // Seed Categories
  await prisma.category.createMany({
    data: [
      {
        name: "Vitamins & Supplements",
        description: "Daily essential nutrients",
        href: "/categories/vitamins",
      },
      {
        name: "Personal Care",
        description: "Hygiene and grooming",
        href: "/categories/personal-care",
      },
      {
        name: "Healthcare Devices",
        description: "Monitors and equipment",
        href: "/categories/devices",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
