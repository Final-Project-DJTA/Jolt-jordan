import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Menggabungkan class Tailwind dengan aman dan konsisten.
 * Gunakan `cn(...)` untuk menulis className yang dinamis.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
