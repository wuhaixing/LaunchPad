import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string, length: number) => {
  return text.length > length ? text.slice(0, length) + "..." : text;
};

export const formatNumber = (
  number: number,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

export const isMobile = () => {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width <= 1024;
};
