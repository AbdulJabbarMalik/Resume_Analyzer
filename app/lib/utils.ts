import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return Math.floor(bytes / (1024 * 1024 * 1024)) + " GB";
  } else if (bytes >= 1024 * 1024) {
    return Math.floor(bytes / (1024 * 1024)) + " MB";
  } else if (bytes >= 1024) {
    return Math.floor(bytes / 1024) + " KB";
  } else {
    return bytes + " bytes";
  }
}

export const generateUUID = () => crypto.randomUUID();

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}