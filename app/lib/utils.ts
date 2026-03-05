import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSupabaseBrowserClient } from "./supabase";
import type { FileUploadProps } from "~/components/ui/file-upload";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randString() {
  let random = (Math.random() + 1).toString(36).substring(4);
  return random;
}

export function getFilenameFromUrl(url_string: string) {
  try {
    const url = new URL(url_string);

    const pathname = url.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

    return filename;
  } catch (error) {
    console.log(error);
    return null;
  }
}
