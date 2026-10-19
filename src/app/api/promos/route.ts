import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    // 1. Validation mode for Cart checkout
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      const promo = await prisma.promoCode.findUnique({
        where: { code: cleanCode },
      });

      if (!promo || !promo.isActive) {
        return NextResponse.json(
          { success: false, error: 'كود الخصم غير صالح أو غير مفعّل' },
          { status: 404 }
        );
      }

      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
        return NextResponse.json(
          { success: false, error: 'كود الخصم انتهت صلاحيته' },
          { status: 400 }
        );
      }

      if (promo.maxUsage && promo.usedCount >= promo.maxUsage) {
        return NextResponse.json(
          { success: false, error: 'وصل كود الخصم للحد الأقصى لمرات الاستخدام' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        promo: {
          id: promo.id,
          code: promo.code,
          discountPercent: promo.discountPercent,
        },
      });
    }

    // 2. Admin list mode: fetch all promo codes
    let promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed default promo codes if none exist
    if (promos.length === 0) {
      await prisma.promoCode.createMany({
        data: [
          { code: 'LOLA', discountPercent: 10, maxUsage: 500, isActive: true },
          { code: 'BAGY10', discountPercent: 10, maxUsage: 500, isActive: true },
        ],
        skipDuplicates: true,
      });

      promos = await prisma.promoCode.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, promos });
  } catch (error: any) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, discountPercent, maxUsage } = body;

    if (!code || discountPercent === undefined || discountPercent === null) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال كود الخصم ونسبة الخصم' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const percent = Number(discountPercent);

    if (isNaN(percent) || percent < 1 || percent > 100) {
      return NextResponse.json(
        { success: false, error: 'نسبة الخصم يجب أن تكون رقماً بين 1 و 100%' },
        { status: 400 }
      );
    }

    // Check if code exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `كود الخصم "${cleanCode}" مسجل مسبقاً بالفعل` },
        { status: 400 }
      );
    }

    const newPromo = await prisma.promoCode.create({
      data: {
        code: cleanCode,
        discountPercent: percent,
        maxUsage: Number(maxUsage) || 500,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, promo: newPromo });
  } catch (error: any) {
    console.error('Error creating promo code:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Promo code ID is required' }, { status: 400 });
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
