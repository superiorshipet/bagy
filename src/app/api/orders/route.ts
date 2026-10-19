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

    // Create order notification for customer
    if (newOrder.userId) {
      try {
        await prisma.notification.create({
          data: {
            userId: newOrder.userId,
            title: `تم استلام طلبك ${newOrder.orderNumber} بنجاح 🎉`,
            message: `شكراً لثقتك في BAGY! طلبك قيد المراجعة وسنبدأ في تصنيعه يدوياً بعناية.`,
            type: 'order',
            orderId: newOrder.id,
          },
        });
      } catch (ne) {
        console.error('Failed to create notification on order create:', ne);
      }
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, action } = body;
    let status = body.status;

    if (action === 'cancel') {
      status = OrderStatus.CANCELLED;
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    // Send notification to customer for status changes
    if (updated.userId) {
      let notifTitle = '';
      let notifMessage = '';

      if (status === 'CANCELLED') {
        notifTitle = `تم إلغاء الطلب ${updated.orderNumber}`;
        notifMessage = `تم إلغاء طلبك بنجاح. إذا كان لديك استفسار يمكنك التواصل مع خدمة عملاء باجي.`;
      } else if (status === 'IN_PRODUCTION') {
        notifTitle = `بدء التفصيل لطلبك ${updated.orderNumber} 🧵`;
        notifMessage = `شنطتك دخلت الآن خط الخياطة والتطريز اليدوي بعناية ودقة فائقة!`;
      } else if (status === 'QUALITY_CHECK') {
        notifTitle = `فحص الجودة لطلبك ${updated.orderNumber} 🔍`;
        notifMessage = `تخضع شنطتك الآن لفحص الجودة الدقيق للتأكد من مطابقة جميع التفاصيل.`;
      } else if (status === 'SHIPPED') {
        notifTitle = `طلبك في الطريق إليك ${updated.orderNumber} 🚚`;
        notifMessage = `تم تسليم شنطتك لمندوب الشحن وهي الآن في طريقها إلى عنوانك.`;
      } else if (status === 'DELIVERED') {
        notifTitle = `تم تسليم طلبك ${updated.orderNumber} بنجاح ✨`;
        notifMessage = `مبروك استلام شنطتك الفاخرة من BAGY! نأمل أن تنال إعجابك وتكون تجربة لا تُنسى.`;
      } else if (status === 'CONFIRMED') {
        notifTitle = `تم تأكيد طلبك ${updated.orderNumber} ✓`;
        notifMessage = `تم تأكيد طلبك وجاري تجهيز الخامات للبدء في خط الإنتاج.`;
      }

      if (notifTitle) {
        try {
          await prisma.notification.create({
            data: {
              userId: updated.userId,
              title: notifTitle,
              message: notifMessage,
              type: 'order',
              orderId: updated.id,
            },
          });
        } catch (ne) {
          console.error('Failed to create status notification:', ne);
        }
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
