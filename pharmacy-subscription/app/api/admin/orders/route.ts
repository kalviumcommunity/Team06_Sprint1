import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const where: Record<string, unknown> = {};

    if (statusFilter !== 'ALL') {
      where.status = statusFilter;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { items: { some: { medicineName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { select: { id: true, medicineName: true, quantity: true, unitPrice: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    // Summary counts for all statuses (always over full table)
    const [processingCount, shippedCount, deliveredCount, cancelledCount, pendingCount, totalOrders] =
      await Promise.all([
        prisma.order.count({ where: { status: 'Processing' } }),
        prisma.order.count({ where: { status: 'Shipped' } }),
        prisma.order.count({ where: { status: 'Delivered' } }),
        prisma.order.count({ where: { status: 'Cancelled' } }),
        prisma.order.count({ where: { status: 'Pending' } }),
        prisma.order.count(),
      ]);

    const formattedOrders = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      userName: o.user.name,
      userEmail: o.user.email,
      status: o.status,
      totalAmount: o.totalAmount,
      deliveryAddress: o.deliveryAddress,
      trackingId: o.trackingId,
      scheduledDate: o.scheduledDate?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.id,
        medicineName: i.medicineName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      summary: {
        total: totalOrders,
        pending: pendingCount,
        processing: processingCount,
        shipped: shippedCount,
        delivered: deliveredCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
