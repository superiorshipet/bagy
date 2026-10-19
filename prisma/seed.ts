import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { BAG_TYPES, FEATURED_PRODUCTS } from '../src/data/bagOptions';

async function main() {
  console.log('🌱 Starting database seed for bagy_db...');

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bagy.eg' },
    update: {},
    create: {
      name: 'مدير النظام (Admin)',
      email: 'admin@bagy.eg',
      phone: '01012345678',
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user ready:', admin.email);

  // 2. Create Sample Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'sarah.ahmed@example.com' },
    update: {},
    create: {
      name: 'سارة أحمد',
      email: 'sarah.ahmed@example.com',
      phone: '01123456789',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            label: 'المنزل',
            city: 'القاهرة',
            area: 'التجمع الخامس - النرجس',
            street: 'شارع التسعين الجنوبي',
            building: 'فيلا 14',
            isDefault: true,
          },
          {
            label: 'العمل',
            city: 'القاهرة',
            area: 'المعادي',
            street: 'شارع اللاسلكي',
            isDefault: false,
          },
        ],
      },
    },
  });
  console.log('👤 Sample Customer ready:', customer.name);

  // 3. Seed Categories
  for (const cat of BAG_TYPES) {
    await prisma.category.upsert({
      where: { slug: cat.id },
      update: {
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        basePrice: cat.basePrice,
        descriptionAr: cat.descriptionAr,
        descriptionEn: cat.descriptionEn,
        image: cat.image,
      },
      create: {
        slug: cat.id,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        basePrice: cat.basePrice,
        descriptionAr: cat.descriptionAr,
        descriptionEn: cat.descriptionEn,
        image: cat.image,
      },
    });
  }
  console.log(`🗂️ Seeded ${BAG_TYPES.length} categories`);

  // 4. Seed Products
  for (const prod of FEATURED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        price: prod.price,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
      create: {
        id: prod.id,
        nameEn: prod.nameEn,
        nameAr: prod.nameAr,
        category: prod.category,
        price: prod.price,
        image: prod.image,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        isCustomizable: prod.isCustomizable,
        isBestSeller: prod.isBestSeller ?? false,
        isNewArrival: prod.isNewArrival ?? false,
      },
    });
  }
  console.log(`👜 Seeded ${FEATURED_PRODUCTS.length} products`);

  // 4. Seed Active Promo Codes
  await prisma.promoCode.upsert({
    where: { code: 'LOLA' },
    update: {},
    create: {
      code: 'LOLA',
      discountPercent: 10,
      maxUsage: 500,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: 'BAGY10' },
    update: {},
    create: {
      code: 'BAGY10',
      discountPercent: 10,
      maxUsage: 1000,
    },
  });

  // 5. Seed Sample Orders with Customizations for the Customer
  const existingOrder = await prisma.order.findFirst({
    where: { orderNumber: 'BGY-948215' },
  });

  if (!existingOrder) {
    const customBag = await prisma.customization.create({
      data: {
        bagType: 'tote',
        size: 'medium',
        materialId: 'smooth_calfskin',
        primaryColor: '#8a1d63',
        hardware: 'gold',
        strapId: 'matching_leather',
        monogramEnabled: true,
        monogramText: 'SARAH',
        monogramStyle: 'gold_foil',
        calculatedPrice: 2450,
      },
    });

    await prisma.order.create({
      data: {
        orderNumber: 'BGY-948215',
        userId: customer.id,
        customerName: 'سارة أحمد',
        customerPhone: '01123456789',
        deliveryArea: 'التجمع الخامس / القاهرة الجديدة',
        fullAddress: 'التجمع الخامس - شارع التسعين فيلا 14',
        subtotal: 2450,
        discount: 245,
        deliveryFee: 0,
        total: 2205,
        promoCode: 'LOLA',
        paymentMethod: 'apple_pay',
        status: 'IN_PRODUCTION', // في خط التصنيع
        isGift: true,
        recipientName: 'منى إبراهيم',
        giftMessage: 'ألف مبروك التخرج يا أجمل منى عقبال أعلى المناصب ❤️',
        items: {
          create: [
            {
              customizationId: customBag.id,
              quantity: 1,
              unitPrice: 2450,
              summaryText: 'توت باج كلاسيك - توتي لولا فاخر (حفر: SARAH)',
            },
          ],
        },
      },
    });

    await prisma.order.create({
      data: {
        orderNumber: 'BGY-781290',
        userId: customer.id,
        customerName: 'سارة أحمد',
        customerPhone: '01123456789',
        deliveryArea: 'المعادي ودجلة',
        subtotal: 1850,
        discount: 0,
        deliveryFee: 0,
        total: 1850,
        paymentMethod: 'card',
        status: 'DELIVERED', // تم التسليم
        items: {
          create: [
            {
              quantity: 1,
              unitPrice: 1850,
              summaryText: 'كروس بودي نسيم النيل - جلد سافيانو جملي',
            },
          ],
        },
      },
    });

    console.log('📦 Seeded sample customer orders with status timeline');
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
