import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    const inProductionOrders = await prisma.order.count({ where: { status: 'IN_PRODUCTION' } });
    const deliveredOrders = await prisma.order.count({ where: { status: 'DELIVERED' } });

    const totalRevenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    });

    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            customization: true,
          },
        },
      },
    });

    const productsCount = await prisma.product.count();
    const customersCount = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: totalRevenueAgg._sum.total || 0,
        totalOrders,
        pendingOrders,
        inProductionOrders,
        deliveredOrders,
        productsCount,
        customersCount,
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
