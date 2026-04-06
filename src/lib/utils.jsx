// src/lib/utils.jsx

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges class names safely
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
