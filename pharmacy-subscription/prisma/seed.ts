import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Hash the demo user password
  const hashedPassword = await bcrypt.hash('anish@123', 12);

  // Create demo user with hashed password
  const user = await prisma.user.upsert({
    where: { email: 'user@pharmaeasy.com' },
    update: { password: hashedPassword },
    create: {
      id: 'usr_demo_101',
      email: 'user@pharmaeasy.com',
      name: 'Anish Kumar',
      password: hashedPassword,
    },
  });

  // Create medicines
  const metformin = await prisma.medicine.upsert({
    where: { id: 'med_metformin_500' },
    update: {},
    create: {
      id: 'med_metformin_500',
      name: 'Metformin 500mg',
      dosage: '500mg',
      price: 45.0,
      description: 'Used for blood sugar management',
    },
  });

  const amlodipine = await prisma.medicine.upsert({
    where: { id: 'med_amlodipine_5' },
    update: {},
    create: {
      id: 'med_amlodipine_5',
      name: 'Amlodipine 5mg',
      dosage: '5mg',
      price: 38.0,
      description: 'Used for blood pressure',
    },
  });

  const levothyroxine = await prisma.medicine.upsert({
    where: { id: 'med_levothyroxine_50' },
    update: {},
    create: {
      id: 'med_levothyroxine_50',
      name: 'Levothyroxine 50mcg',
      dosage: '50mcg',
      price: 55.0,
      description: 'Thyroid hormone replacement',
    },
  });

  const vitaminD = await prisma.medicine.upsert({
    where: { id: 'med_vitamind3_1000' },
    update: {},
    create: {
      id: 'med_vitamind3_1000',
      name: 'Vitamin D3 1000IU',
      dosage: '1000IU',
      price: 60.0,
      description: 'Vitamin supplement',
    },
  });

  const cetirizine = await prisma.medicine.upsert({
    where: { id: 'med_cetirizine_10' },
    update: {},
    create: {
      id: 'med_cetirizine_10',
      name: 'Cetirizine 10mg',
      dosage: '10mg',
      price: 36.0,
      description: 'Antihistamine for allergies',
    },
  });

  const ibuprofen = await prisma.medicine.upsert({
    where: { id: 'med_ibuprofen_400' },
    update: {},
    create: {
      id: 'med_ibuprofen_400',
      name: 'Ibuprofen 400mg',
      dosage: '400mg',
      price: 72.0,
      description: 'Pain reliever and anti-inflammatory',
    },
  });

  // Create demo subscription
  const subscription = await prisma.subscription.upsert({
    where: { id: 'sub_monthly_001' },
    update: {},
    create: {
      id: 'sub_monthly_001',
      userId: user.id,
      status: 'active',
    },
  });

  // Clean existing orders to allow idempotent seed
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  // Create Order 1 - Delivered
  await prisma.order.create({
    data: {
      id: 'ord_9821',
      orderNumber: 'ORD-9821',
      userId: user.id,
      subscriptionId: subscription.id,
      status: 'Delivered',
      totalAmount: 166.0,
      deliveryAddress: '42 MG Road, Bengaluru - 560001',
      trackingId: 'TRK9821001IN',
      scheduledDate: new Date('2026-07-12'),
      createdAt: new Date('2026-07-12T10:30:00Z'),
      items: {
        create: [
          {
            medicineId: metformin.id,
            medicineName: 'Metformin 500mg ×60',
            quantity: 2,
            unitPrice: 45.0,
          },
          {
            medicineId: amlodipine.id,
            medicineName: 'Amlodipine 5mg ×30',
            quantity: 2,
            unitPrice: 38.0,
          },
        ],
      },
    },
  });

  // Create Order 2 - Delivered
  await prisma.order.create({
    data: {
      id: 'ord_9745',
      orderNumber: 'ORD-9745',
      userId: user.id,
      subscriptionId: subscription.id,
      status: 'Delivered',
      totalAmount: 55.0,
      deliveryAddress: '42 MG Road, Bengaluru - 560001',
      trackingId: 'TRK9745002IN',
      scheduledDate: new Date('2026-06-15'),
      createdAt: new Date('2026-06-15T14:15:00Z'),
      items: {
        create: [
          {
            medicineId: levothyroxine.id,
            medicineName: 'Levothyroxine 50mcg ×30',
            quantity: 1,
            unitPrice: 55.0,
          },
        ],
      },
    },
  });

  // Create Order 3 - Processing
  await prisma.order.create({
    data: {
      id: 'ord_9901',
      orderNumber: 'ORD-9901',
      userId: user.id,
      subscriptionId: subscription.id,
      status: 'Processing',
      totalAmount: 96.0,
      deliveryAddress: '42 MG Road, Bengaluru - 560001',
      trackingId: 'TRK9901003IN',
      scheduledDate: new Date('2026-07-14'),
      createdAt: new Date('2026-07-14T09:00:00Z'),
      items: {
        create: [
          {
            medicineId: vitaminD.id,
            medicineName: 'Vitamin D3 1000IU ×60',
            quantity: 1,
            unitPrice: 60.0,
          },
          {
            medicineId: cetirizine.id,
            medicineName: 'Cetirizine 10mg ×30',
            quantity: 1,
            unitPrice: 36.0,
          },
        ],
      },
    },
  });

  // Create Order 4 - Cancelled
  await prisma.order.create({
    data: {
      id: 'ord_9012',
      orderNumber: 'ORD-9012',
      userId: user.id,
      subscriptionId: subscription.id,
      status: 'Cancelled',
      totalAmount: 72.0,
      deliveryAddress: '42 MG Road, Bengaluru - 560001',
      trackingId: 'TRK9012004IN',
      scheduledDate: new Date('2026-07-08'),
      createdAt: new Date('2026-07-08T16:45:00Z'),
      items: {
        create: [
          {
            medicineId: ibuprofen.id,
            medicineName: 'Ibuprofen 400mg ×20',
            quantity: 1,
            unitPrice: 72.0,
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
