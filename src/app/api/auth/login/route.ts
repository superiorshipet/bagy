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
              password: 'admin',
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

    // 2. Customer Sign Up (New Account with Phone + Password)
    if (action === 'signup') {
      if (!phone || !password) {
        return NextResponse.json(
          { success: false, error: 'يرجى إدخال رقم الهاتف وكلمة السر' },
          { status: 400 }
        );
      }

      const cleanPhone = phone.replace(/\s+/g, '');
      if (cleanPhone.length < 9) {
        return NextResponse.json(
          { success: false, error: 'يرجى إدخال رقم هاتف صحيح' },
          { status: 400 }
        );
      }

      if (password.length < 4) {
        return NextResponse.json(
          { success: false, error: 'كلمة السر يجب أن لا تقل عن 4 خانات' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: { phone: cleanPhone },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'رقم الهاتف مسجل بالفعل! يرجى تسجيل الدخول مباشرة بكلمة السر' },
          { status: 400 }
        );
      }

      const newUser = await prisma.user.create({
        data: {
          name: name || `عميل ${cleanPhone.slice(-4)}`,
          email: `${cleanPhone}@bagy.customer`,
          phone: cleanPhone,
          password: password,
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

      return NextResponse.json({
        success: true,
        user: newUser,
        token: `customer_${newUser.id}`,
      });
    }

    // 3. Customer Login via Phone + Password
    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'يرجى إدخال كلمة السر الخاصة بحسابك' },
          { status: 400 }
        );
      }

      let user = await prisma.user.findFirst({
        where: { phone: cleanPhone },
        include: { addresses: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'رقم الهاتف غير مسجل لدينا، يرجى إنشاء حساب جديد أولاً' },
          { status: 404 }
        );
      }

      // If user had a password, check it
      if (user.password && user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'كلمة السر غير صحيحة، يرجى المحاولة مرة أخرى' },
          { status: 401 }
        );
      }

      // If user had no password yet (created before password requirement), set it now
      if (!user.password) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { password: password },
          include: { addresses: true },
        });
      }

      return NextResponse.json({
        success: true,
        user,
        token: `customer_${user.id}`,
      });
    }

    return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الهاتف وكلمة السر' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
