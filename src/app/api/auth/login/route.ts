import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@/generated/prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email, password, code, action, name } = body;

    // 1. Admin Login via Email & Password
    if (action === 'admin_login' || email === 'admin@bagy.eg') {
      if (password === 'admin123' || code === '1234' || password === 'admin') {
        let admin = await prisma.user.findUnique({
          where: { email: 'admin@bagy.eg' },
        });

        if (!admin) {
          admin = await prisma.user.create({
            data: {
              name: 'مدير النظام (Admin)',
              email: 'admin@bagy.eg',
              phone: '01012345678',
              role: Role.ADMIN,
            },
          });
        }

        return NextResponse.json({
          success: true,
          user: admin,
          token: 'admin_session_token',
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور غير صحيحة لحساب الأدمن' },
          { status: 401 }
        );
      }
    }

    // 2. Customer Phone / Mobile Login (Like Lola.do)
    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');

      // Check if user exists by phone
      let user = await prisma.user.findFirst({
        where: { phone: cleanPhone },
        include: { addresses: true },
      });

      // If user doesn't exist, create an account
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: name || `عميل ${cleanPhone.slice(-4)}`,
            email: `${cleanPhone}@bagy.customer`,
            phone: cleanPhone,
            role: Role.CUSTOMER,
            addresses: {
              create: [
                {
                  label: 'المنزل',
                  city: 'القاهرة',
                  area: 'التجمع الخامس',
                  street: 'شارع التسعين',
                  isDefault: true,
                },
              ],
            },
          },
          include: { addresses: true },
        });
      }

      return NextResponse.json({
        success: true,
        user,
        token: `customer_${user.id}`,
      });
    }

    return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الهاتف' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
