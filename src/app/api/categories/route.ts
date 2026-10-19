import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BAG_TYPES } from '@/data/bagOptions';

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Auto-seed default categories if table is empty
    if (categories.length === 0) {
      const defaultCategories = BAG_TYPES.map((bt) => ({
        slug: bt.id,
        nameAr: bt.nameAr,
        nameEn: bt.nameEn,
        icon: bt.icon,
        basePrice: bt.basePrice,
        descriptionAr: bt.descriptionAr,
        descriptionEn: bt.descriptionEn,
        image: bt.image,
      }));

      await prisma.category.createMany({
        data: defaultCategories,
        skipDuplicates: true,
      });

      categories = await prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nameAr, nameEn, slug, icon, basePrice, descriptionAr, descriptionEn, image } = body;

    if (!nameAr || !nameEn) {
      return NextResponse.json(
        { success: false, error: 'اسم الفئة بالعربي والإنجليزي مطلوب' },
        { status: 400 }
      );
    }

    const finalSlug = (slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || `cat_${Date.now()}`).trim();

    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'هذه الفئة موجودة بالفعل أو المعرّف مستخدم مسبقاً' },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        slug: finalSlug,
        nameAr,
        nameEn,
        icon: icon || '👜',
        basePrice: Number(basePrice) || 1850,
        descriptionAr: descriptionAr || `موديلات وتصاميم فئة ${nameAr}`,
        descriptionEn: descriptionEn || nameEn,
        image: image || null,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nameAr, nameEn, icon, basePrice, descriptionAr, descriptionEn, image } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(nameAr !== undefined && { nameAr }),
        ...(nameEn !== undefined && { nameEn }),
        ...(icon !== undefined && { icon }),
        ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    // Check count of remaining categories to prevent zeroing
    const totalCount = await prisma.category.count();
    if (totalCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'لا يمكن حذف جميع الفئات، يجب أن تبقى فئة واحدة على الأقل' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
