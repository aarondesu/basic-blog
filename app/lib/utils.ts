import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randString() {
  let random = (Math.random() + 1).toString(36).substring(7);
  return random;
}
