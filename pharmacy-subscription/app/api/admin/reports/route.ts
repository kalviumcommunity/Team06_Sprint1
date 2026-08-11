import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Derive a category label from a medicine name.
 * Maps common medicine keywords to healthcare categories.
 */
function deriveCategoryFromMedicineName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('metformin') || lower.includes('glipizide') || lower.includes('insulin') || lower.includes('gluco')) {
    return 'Diabetes';
  }
  if (lower.includes('amlodipine') || lower.includes('atenolol') || lower.includes('lisinopril') || lower.includes('cardiac') || lower.includes('heart')) {
    return 'Cardiac';
  }
  if (lower.includes('levothyroxine') || lower.includes('thyroid') || lower.includes('thyrox')) {
    return 'Thyroid';
  }
  if (lower.includes('vitamin') || lower.includes('calcium') || lower.includes('omega') || lower.includes('supplement') || lower.includes('zinc') || lower.includes('iron')) {
    return 'Supplements';
  }
  if (lower.includes('cetirizine') || lower.includes('loratadine') || lower.includes('allerg')) {
    return 'Allergy';
  }
  if (lower.includes('ibuprofen') || lower.includes('paracetamol') || lower.includes('aspirin') || lower.includes('pain') || lower.includes('naproxen')) {
    return 'Pain Relief';
  }
  return 'Other';
}

export async function GET() {
  try {
    // ── 1. Revenue Trend: group successful payments by month ──────────────────
    const successPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const revenueByMonth: Record<string, number> = {};
    for (const p of successPayments) {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth()).padStart(2, '0')}`;
      revenueByMonth[key] = (revenueByMonth[key] ?? 0) + p.amount;
    }

    // Sort by year-month and map to display format
    const revenueTrend = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue]) => {
        const [year, monthIndex] = key.split('-').map(Number);
        return {
          month: `${MONTH_NAMES[monthIndex]} ${year}`,
          revenue: Math.round(revenue * 100) / 100,
        };
      });

    // ── 2. Monthly Orders: group all orders by month ──────────────────────────
    const allOrders = await prisma.order.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const ordersByMonth: Record<string, number> = {};
    for (const o of allOrders) {
      const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth()).padStart(2, '0')}`;
      ordersByMonth[key] = (ordersByMonth[key] ?? 0) + 1;
    }

    const monthlyOrders = Object.entries(ordersByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => {
        const [year, monthIndex] = key.split('-').map(Number);
        return {
          month: `${MONTH_NAMES[monthIndex]} ${year}`,
          orders: count,
        };
      });

    // ── 3. Top Categories: derive categories from order items ────────────────
    const orderItems = await prisma.orderItem.findMany({
      select: { medicineName: true, quantity: true },
    });

    const categoryCount: Record<string, number> = {};
    for (const item of orderItems) {
      const cat = deriveCategoryFromMedicineName(item.medicineName);
      categoryCount[cat] = (categoryCount[cat] ?? 0) + item.quantity;
    }

    const totalItems = Object.values(categoryCount).reduce((s, v) => s + v, 0);

    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
      }));

    return NextResponse.json({
      revenueTrend,
      monthlyOrders,
      topCategories,
    });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return NextResponse.json({ error: 'Failed to fetch reports data' }, { status: 500 });
  }
}
