import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email') || 'sarah.ahmed@example.com';

    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
        orders: {
          include: {
            items: {
              include: {
                customization: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: {
          addresses: true,
          orders: {
            include: {
              items: {
                include: {
                  customization: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, phone, email } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: { name, phone, email },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
