import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "BAGY | تفصيل وتخصيص الشنط والحقائب الفاخرة أونلاين",
  description: "المنصة الأولى في مصر لتفصيل الشنط والحقائب الجلدية يدوياً حسب اختيارك مع حفر اسمك بالذهب والتوصيل لباب بيتك.",
  keywords: ["شنط", "تفصيل شنط", "شنط جلد طبيعي", "شنط هدايا", "حقائب مخصصة", "bagy", "bags egypt"],
  openGraph: {
    title: "BAGY | صممي شنطتك الحلم بلمسة يدك",
    description: "تفصيل يدوي فاخر لشنط الجلد الطبيعي مع حفر الاسم بالذهب وتوصيل لجميع محافظات مصر.",
    locale: "ar_EG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#9b287b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors selection:bg-[#9b287b] selection:text-white">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
