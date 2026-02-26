import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { FileUploadProps } from "~/components/ui/file-upload";
import { getSupabaseBrowserClient } from "~/lib/supabase";
import { randString } from "~/lib/utils";

export function useUploadImage({
  onUploadSuccess,
}: {
  onUploadSuccess: (url: string) => void;
}) {
  const client = getSupabaseBrowserClient();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onError, onProgress }) => {
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

          onUploadSuccess(data.publicUrl);
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
    onUpload,
  };
}
