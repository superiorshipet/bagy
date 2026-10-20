# BAGY - Custom Luxury Handbag Atelier and E-Commerce Platform

BAGY is a full-stack, enterprise-grade e-commerce application and interactive atelier for bespoke luxury handbags. The platform combines artisanal craftsmanship with modern web technologies, enabling customers to configure every detail of a handbag in real time—from silhouettes, premium leathers, and dual-tone strap colors to metallic hardware finishes and unrestricted monogram personalization. The platform also offers instant purchasing for ready-to-wear models, multi-currency conversion, production order tracking, a notification center, and a comprehensive administrative control panel backed by PostgreSQL and Prisma ORM.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [System Architecture and Directory Structure](#system-architecture-and-directory-structure)
- [Database Schema and Models](#database-schema-and-models)
- [REST API Reference](#rest-api-reference)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Available Scripts](#available-scripts)
- [Default Seed and Test Credentials](#default-seed-and-test-credentials)
- [UI and Design Principles](#ui-and-design-principles)
- [License](#license)

---

## Overview

BAGY bridges high-end bespoke leather crafting with digital commerce. The platform provides a responsive, bidirectional (Arabic RTL first, English ready) interface powered by Next.js 16 (App Router) and React 19. It features a custom vector-based canvas customizer that updates live with every selected attribute, a frictionless checkout experience with promotional codes and multi-currency pricing, and a production management workflow for workshop artisans and store administrators.

---

## Core Features

### 1. Interactive Bag Studio and Customizer
- **Silhouette Selection:** Choose from multiple styles including Classic Tote, Crossbody, Shoulder Bag, Mini Bag, Christy, V-Shape, and Leather Backpack.
- **Leather and Material Engine:** Selection of genuine leathers including Saffiano, Smooth Italian Calfskin, Velvet Nubuck, Embossed Crocodile, and Pebbled Grain.
- **Dual-Tone Customization:** Independent color palettes for the bag body and handles/straps.
- **Hardware Finish Engine:** Metallic accents available in Classic Gold, Sterling Silver, Rose Gold, Gunmetal, and Matte Black.
- **Strap and Hardware Variations:** Classic stitched leather straps, interwoven chain-leather straps, and wide patterned canvas straps.
- **Unrestricted Monogram Personalization:** Custom gold foil and embossed monograms with unlimited character support, automatically scaled dynamically using SVG vector transforms to fit the bag surface proportionately.
- **Real-Time Vector Rendering:** Canvas preview rendered using interactive SVG vectors with realistic lighting, metallic accents, and seam textures.
- **Instant Purchasing:** Direct checkout button allowing instant acquisition of customized designs without intermediate navigation.

### 2. Storefront and Catalog
- **Category Browsing:** Categorized product listings with real-time filtering, ratings, and customer reviews.
- **Direct Acquisition (Ready-to-Wear):** Instant purchase flow for pre-configured, in-stock handbag designs.
- **Dynamic Pricing and Shipping:** Automated calculation of subtotal, discounts, regional delivery fees, and taxes.
- **Luxury Gifting Suite:** Bespoke gift packaging, customized greeting cards with personal messaging, and direct delivery to recipient addresses.

### 3. Multi-Currency Engine
- Seamless, live conversion between five international and regional currencies:
  - Egyptian Pound (EGP) - Base Currency
  - Saudi Riyal (SAR)
  - UAE Dirham (AED)
  - US Dollar (USD)
  - Euro (EUR)
- Instant re-calculation across the storefront, configurator, cart drawer, checkout, and order history, with user preference persisted in session storage.

### 4. Authentication and User Profiles
- **Credentials:** Login and registration using phone number and secure password, with email support.
- **Role-Based Access Control:** Separation between `CUSTOMER` and `ADMIN` permissions.
- **Address Book:** Management of multiple shipping addresses with default address designation.
- **Order Tracking:** Comprehensive order history displaying chronological production milestones and item breakdowns.
- **Self-Service Order Cancellation:** Customers can cancel orders directly while in the `PENDING` review stage.

### 5. Notification Center
- Dropdown panel accessible from the navigation bar with an unread badge counter.
- Automated updates triggered when order status changes in the production line.
- Administrative broadcasts for promotions, announcements, and discounts.
- Individual notification deletion and "Mark all as read" capability.
- Viewport-aware positioning preventing screen overflow on both mobile and desktop viewports.

### 6. Administrative Control Panel
- **Executive Metrics:** Real-time summary cards for total revenue, total orders, completed deliveries, and registered customers.
- **Production Pipeline Workflow:** Granular status progression:
  - PENDING (Under Review)
  - IN_PRODUCTION (Workshop & Tailoring)
  - SHIPPED (In Transit)
  - DELIVERED (Completed)
  - CANCELLED (Revoked)
- **Product and Category Management:** Add new handbag models, update pricing, toggle availability, and monitor inventory levels.
- **Promo Code Management:** Create custom promotional codes with percentage discounts, maximum usage limits, and activation states; delete obsolete codes instantly.
- **Customer Directory:** View customer accounts, contact details, and historical orders.
- **Broadcast Messaging:** Dispatch instant notifications to individual users or all registered customers.

---

## Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Framework | Next.js (App Router, Turbopack) | 16.4.2 | Server and client rendering, API route handling |
| UI Library | React | 19.3.0 | Component architecture and state lifecycle |
| Language | TypeScript | 5.x | Static typing, interface definitions, and compile-time safety |
| Database | PostgreSQL | 14+ | Relational data persistence |
| ORM | Prisma ORM | 7.10.1 | Type-safe database queries, schema migrations, and relational mapping |
| Styling | Tailwind CSS | 4.x | Utility-first styling with comprehensive dark mode support |
| Icons | Lucide React | 1.59.0 | Scalable vector icon library |
| Utilities | clsx / tailwind-merge | 2.x / 3.x | Conditional CSS class merging and resolution |
| Visual Effects | canvas-confetti | 1.9.4 | Order completion celebration animations |

---

## System Architecture and Directory Structure

```text
bagy/
├── prisma/
│   ├── schema.prisma            # Prisma schema: models, relations, and enums
│   └── seed.ts                  # Database seeding script for admin, customers, and inventory
├── public/
│   └── images/                  # Static assets and product photography
├── src/
│   ├── app/
│   │   ├── api/                 # Next.js Serverless API Route Handlers
│   │   │   ├── admin/           # Administrative statistics and user management
│   │   │   ├── auth/            # Authentication endpoints (phone/password login)
│   │   │   ├── categories/      # Silhouette category CRUD operations
│   │   │   ├── notifications/   # Notification retrieval, dispatch, and read state
│   │   │   ├── orders/          # Order submission, status updates, and cancellation
│   │   │   ├── products/        # Product catalog operations
│   │   │   ├── promos/          # Promo code creation, validation, and deletion
│   │   │   └── user/            # Customer profile and address book management
│   │   ├── globals.css          # Global Tailwind styles and CSS variables
│   │   ├── layout.tsx           # Root layout, fonts, and global context wrappers
│   │   └── page.tsx             # Main storefront and configurator page
│   ├── components/
│   │   ├── admin/               # Admin dashboard modal and tab views
│   │   ├── auth/                # Login, registration, and password authentication modals
│   │   ├── cart/                # Sliding cart drawer, promo input, and checkout flow
│   │   ├── configurator/        # Interactive bag studio, canvas preview, and step controls
│   │   ├── gifts/               # Gifting options and greeting card modals
│   │   ├── layout/              # TopBar, navigation, footer, and notification dropdown
│   │   ├── profile/             # Customer profile, address manager, and order tracking
│   │   └── providers/           # Context providers wrapper
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication session and role permissions
│   │   ├── CartContext.tsx      # Cart items, discounts, delivery fees, and order processing
│   │   └── ThemeContext.tsx     # Theme (dark/light), active currency, and location state
│   ├── data/
│   │   └── bagOptions.ts        # Default options for leather, hardware, silhouettes, and products
│   ├── lib/
│   │   ├── prisma.ts            # Singleton Prisma Client instance with PostgreSQL adapter
│   │   └── utils.ts             # Currency conversion formulas and price formatters
│   └── types/                   # TypeScript interfaces and shared type declarations
├── .env.example                 # Environment variable templates
├── package.json                 # Project dependencies and script declarations
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## Database Schema and Models

The application data layer is structured around the following Prisma models:

| Model | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `User` | User accounts for customers and administrators | `id`, `name`, `email`, `phone`, `password`, `role` (`CUSTOMER`, `ADMIN`) |
| `Address` | Shipping addresses associated with customer accounts | `id`, `userId`, `label`, `city`, `area`, `street`, `building`, `isDefault` |
| `Product` | Standard, ready-to-wear inventory items | `id`, `nameEn`, `nameAr`, `category`, `price`, `salePrice`, `image`, `stock`, `isActive` |
| `Category` | Bag silhouettes and base models | `id`, `slug`, `nameAr`, `nameEn`, `icon`, `basePrice`, `image` |
| `Customization` | Bespoke specifications generated by the studio | `id`, `bagType`, `size`, `materialId`, `primaryColor`, `accentColor`, `hardware`, `strapId`, `monogramText`, `calculatedPrice` |
| `Order` | Purchase records, financials, and lifecycle stages | `id`, `orderNumber`, `userId`, `customerName`, `customerPhone`, `subtotal`, `discount`, `total`, `status` (`PENDING`, `IN_PRODUCTION`, `SHIPPED`, `DELIVERED`, `CANCELLED`) |
| `OrderItem` | Line items linked to orders, referencing products or customizations | `id`, `orderId`, `productId`, `customizationId`, `quantity`, `unitPrice`, `summaryText` |
| `PromoCode` | Discount voucher codes and redemption limits | `id`, `code`, `discountPercent`, `maxUsage`, `usedCount`, `isActive`, `expiresAt` |
| `Notification` | System and order alerts dispatched to users | `id`, `userId`, `title`, `message`, `type` (`order`, `promo`, `alert`), `isRead` |
| `Review` | Customer feedback and ratings on products | `id`, `productId`, `userId`, `rating`, `comment` |
| `AdminLog` | Audit log of administrative operations | `id`, `action`, `details`, `adminEmail` |

---

## REST API Reference

### Authentication and User Profile
- `POST /api/auth/login`: Authenticate users via phone number/email and password. Returns user object and role.
- `GET /api/user/profile?userId={id}`: Retrieve customer profile details, saved address book, and complete order history.
- `POST /api/user/profile`: Add a new shipping address or update customer details.

### Orders and Production Pipeline
- `GET /api/orders`: Retrieve orders (filtered by customer ID for regular users, or comprehensive list for administrators).
- `POST /api/orders`: Submit a new order containing standard items or bespoke customization specs.
- `PATCH /api/orders`: Update order status across production stages (Admin), or cancel order (`action: 'cancel'`) when in `PENDING` status (Customer).

### Products and Silhouettes
- `GET /api/products`: Retrieve all active products with optional category filtering.
- `POST /api/products`: Add a new product to the catalog (Admin).
- `GET /api/categories`: Retrieve all bag silhouettes, default base prices, and category metadata.
- `POST /api/categories`: Add or update silhouette categories (Admin).

### Promotional Codes
- `GET /api/promos`: Retrieve all promotional codes with redemption counts and status (Admin).
- `POST /api/promos`: Create a new promotional code with percentage discount and usage limits (Admin).
- `DELETE /api/promos?id={id}`: Permanently delete a promotional code (Admin).

### Notifications
- `GET /api/notifications?userId={id}`: Retrieve targeted customer alerts and general system broadcasts.
- `POST /api/notifications`: Dispatch a new notification to a specific user or broadcast to all users (Admin).
- `PATCH /api/notifications`: Mark a specific notification or all notifications as read.
- `DELETE /api/notifications?id={id}`: Delete a notification from user history.

### System Administration
- `GET /api/admin/stats`: Fetch real-time revenue, order counts, production stage breakdown, and client metrics.
- `GET /api/admin/users`: Retrieve registered user accounts, roles, and order summaries.

---

## Prerequisites

- **Node.js:** Version 18.18.0 or higher (Node 20 LTS or Node 22 recommended).
- **Package Manager:** `npm`, `pnpm`, or `yarn`.
- **Database Engine:** `PostgreSQL` version 14 or higher (running locally or via cloud providers such as Supabase or Neon).

---

## Installation and Setup

### 1. Clone Repository and Navigate to Directory

```bash
git clone https://github.com/superiorship/bagy.git
cd bagy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

Open `.env` and specify your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bagy_db?schema=public"
PORT=3000
NODE_ENV=development
```

### 4. Synchronize Schema and Generate Prisma Client

Push the Prisma schema to your PostgreSQL instance and generate the client bindings:

```bash
npm run db:push
```

### 5. Seed Initial Data

Populate the database with default products, categories, active promo codes, and sample user accounts:

```bash
npm run db:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to:
`http://localhost:3000`

---

## Available Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server with hot module reloading on port 3000 |
| `npm run build` | Generates the Prisma client and produces an optimized production build |
| `npm run start` | Boots the compiled Next.js application in production mode |
| `npm run lint` | Executes ESLint to check for syntax and style issues |
| `npm run db:push` | Synchronizes the schema directly to PostgreSQL without generating migration files |
| `npm run db:seed` | Seeds the database with administrator, customer, catalog, and promo data |

---

## Default Seed and Test Credentials

The database seeding script provides pre-configured credentials for immediate evaluation:

### 1. Administrator Account
- **Phone:** `01012345678`
- **Email:** `admin@bagy.eg`
- **Role:** `ADMIN` (Full access to the Admin Dashboard, production pipeline, promo code generator, and inventory controls)

### 2. Sample Customer Account
- **Phone:** `01123456789`
- **Email:** `sarah.ahmed@example.com`
- **Name:** Sarah Ahmed
- **Role:** `CUSTOMER` (Includes pre-saved Cairo addresses and order history for cancellation and tracking testing)

### 3. Active Promo Codes
- **Code:** `LOLA` (10% discount across entire cart, up to 500 redemptions)
- **Code:** `BAGY10` (10% discount across entire cart, up to 1000 redemptions)

---

## UI and Design Principles

- **Native Right-to-Left (RTL) Layout:** Designed from the ground up with Arabic typography (Cairo and Geist) and proper directional layout, fully adaptable to LTR.
- **Dark and Light Modes:** Cohesive theme switcher maintaining high contrast, legible typography, and consistent color balances in both modes.
- **Quiet Luxury Aesthetic:** Polished, minimalist interface avoiding superfluous visual clutter, debug badges, or extraneous emojis.
- **Responsive Architecture:** Mobile-first approach guaranteeing fluid layouts across small smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **Dynamic Monogram Scaling:** Responsive SVG vector scaling prevents text clipping or visual distortion regardless of letter length.

---

## License

This software is proprietary and confidential. All rights reserved by **BAGY**. Unauthorized copying, distribution, or deployment without explicit written permission is strictly prohibited.
