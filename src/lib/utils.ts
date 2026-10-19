import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = 'EGP' | 'SAR' | 'USD' | 'AED' | 'EUR';

export const CURRENCY_RATES: Record<Currency, { rate: number; symbolAr: string; symbolEn: string }> = {
  EGP: { rate: 1, symbolAr: 'ج.م', symbolEn: 'EGP' },
  SAR: { rate: 0.076, symbolAr: 'ر.س', symbolEn: 'SAR' },
  USD: { rate: 0.0202, symbolAr: '$', symbolEn: 'USD' },
  AED: { rate: 0.074, symbolAr: 'د.إ', symbolEn: 'AED' },
  EUR: { rate: 0.0187, symbolAr: '€', symbolEn: 'EUR' },
};

export function formatPrice(
  price: number,
  currency: string = "EGP",
  locale: "ar" | "en" = "ar"
): string {
  const curr = (currency as Currency) in CURRENCY_RATES ? (currency as Currency) : 'EGP';
  const info = CURRENCY_RATES[curr];
  const converted = Math.round(price * info.rate);
  
  if (locale === "ar") {
    return `${converted.toLocaleString("ar-EG")} ${info.symbolAr}`;
  }
  return `${info.symbolEn} ${converted.toLocaleString("en-US")}`;
}

