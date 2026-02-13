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
  let random = (Math.random() + 1).toString(36).substring(7);
  return random;
}

export function useUploadImage() {
  const client = getSupabaseBrowserClient();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onError, onProgress, onSuccess }) => {
      try {
        setIsUploading(true);

        const uploadPromises = files.map(async (file) => {
          if (!client) return;

          const bucketResult = await client.storage
            .from("images")
            .upload(`${randString()}-${randString()}`, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (bucketResult.error) {
            onError(file, {
              name: bucketResult.error.name,
              message: bucketResult.error.message,
            });
          }

          const { data } = await client.storage
            .from("images")
            .getPublicUrl(bucketResult.data?.path ?? "");

          // Set image_url
          setImageUrl(data.publicUrl);

          onSuccess(file);
        });

        toast.promise(Promise.all(uploadPromises), {
          loading: "Uploading image...",
          success: () => {
            setIsUploading((state) => (state = false));
            return "Successfully uploaded image!";
          },
          error: "Failed to upload image",
        });
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [],
  );

  return {
    isUploading,
    imageUrl,
    onUpload,
  };
}
