import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let whereClause: any = {};
    if (userId) {
      whereClause = {
        OR: [
          { userId },
          { userId: null }, // Global broadcasts from admin
        ],
      };
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { name: true, phone: true },
        },
      },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, type = 'alert', userId, orderId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'عنوان الإشعار ونص الرسالة مطلوبان' },
        { status: 400 }
      );
    }

    // If userId is 'all' or empty, it's a global broadcast to all users
    const targetUserId = userId && userId !== 'all' ? userId : null;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId: targetUserId,
        orderId: orderId || null,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationId, markAllRead, userId } = body;

    if (markAllRead) {
      const whereClause = userId
        ? { OR: [{ userId }, { userId: null }] }
        : {};
      await prisma.notification.updateMany({
        where: whereClause,
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, notification: updated });
    }

    return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
