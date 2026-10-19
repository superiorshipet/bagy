import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: "EGP" | "USD" = "EGP", locale: "ar" | "en" = "ar"): string {
  if (locale === "ar") {
    return `${price.toLocaleString("ar-EG")} ج.م`;
  }
  return `${price.toLocaleString("en-US")} ${currency}`;
}
