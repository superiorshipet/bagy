import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const whereClause = userId ? { userId } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            customization: true,
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      customerName,
      customerPhone,
      deliveryArea,
      fullAddress,
      notes,
      isGift,
      recipientName,
      giftMessage,
      subtotal,
      discount,
      deliveryFee,
      total,
      promoCode,
      paymentMethod,
      items,
    } = body;

    const orderNumber = `BGY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create order with nested items & customizations
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName: customerName || 'عميل باجي',
        customerPhone: customerPhone || '01000000000',
        deliveryArea: deliveryArea || 'القاهرة',
        fullAddress,
        notes,
        isGift: !!isGift,
        recipientName,
        giftMessage,
        subtotal: Number(subtotal),
        discount: Number(discount || 0),
        deliveryFee: Number(deliveryFee || 0),
        total: Number(total),
        promoCode,
        paymentMethod: paymentMethod || 'apple_pay',
        status: OrderStatus.PENDING,
        items: {
          create: items.map((item: any) => {
            if (item.configuration) {
              return {
                unitPrice: Number(item.calculatedPrice),
                quantity: Number(item.quantity),
                summaryText: item.customSummaryText || 'شنطة مخصصة',
                customization: {
                  create: {
                    bagType: item.configuration.bagType,
                    size: item.configuration.size,
                    materialId: item.configuration.materialId,
                    primaryColor: item.configuration.primaryColorId,
                    hardware: item.configuration.hardware,
                    strapId: item.configuration.strapId,
                    monogramEnabled: !!item.configuration.monogram?.enabled,
                    monogramText: item.configuration.monogram?.text || '',
                    monogramStyle: item.configuration.monogram?.style || 'gold_foil',
                    addons: item.configuration.selectedAddonIds || [],
                    calculatedPrice: Number(item.calculatedPrice),
                  },
                },
              };
            } else {
              return {
                productId: item.productId || null,
                unitPrice: Number(item.calculatedPrice),
                quantity: Number(item.quantity),
                summaryText: item.customSummaryText || 'منتج جاهز',
              };
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            customization: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
