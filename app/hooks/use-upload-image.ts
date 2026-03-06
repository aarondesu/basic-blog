import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { FileUploadProps } from "~/components/ui/file-upload";
import { getSupabaseBrowserClient } from "~/lib/supabase";
import { randString } from "~/lib/utils";

export async function uploadImage(file: File): Promise<string> {
  const client = getSupabaseBrowserClient();

  return new Promise<string>(async (resolve, reject) => {
    // Upload file into storage
    const uploadResult = await client.storage
      .from("images")
      .upload(`${randString()}-${randString()}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // Check if there was any errors uploading
    if (uploadResult.error) {
      return reject({
        name: uploadResult.error.name,
        message: uploadResult.error.message,
      });
    }

    // Get the publicly signed url of the image
    const result = await client.storage
      .from("images")
      .getPublicUrl(uploadResult.data.path);

    // resolve the promise by returning the url
    return resolve(result.data.publicUrl);
  });
}

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

          // Upload the image using the promise function
          uploadImage(file)
            .then((url) => onUploadSuccess(url))
            .catch((error) => {
              onError(file, {
                name: error.name,
                message: error.message,
              });
            });
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
