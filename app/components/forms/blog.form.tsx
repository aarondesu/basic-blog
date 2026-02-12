import type { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useNavigation, useSubmit } from "react-router";
import { useAppSelector } from "~/redux/hooks";
import type { BlogData } from "~/types";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  type FileUploadProps,
} from "../ui/file-upload";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { getSupabaseBrowserClient } from "~/lib/supabase";
import { toast } from "sonner";
import { randString } from "~/lib/utils";
import { blogSchema } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

type Args = {
  mode: "create" | "edit";
  data?: {
    body: string;
    created_at: string;
    id: number;
    image_url: string | null;
    title: string;
    udpated_at: string;
    user_id: string;
  };
  error?: PostgrestError;
};

/**
 * Reusable form for both creating and editing the blog
 * @param param0
 * @returns
 */
export default function BlogForm({ mode, data, error }: Args) {
  const { user_id } = useAppSelector((state) => state.auth);
  const navigation = useNavigation();
  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: data?.title ?? "",
      body: data?.body ?? "",
      image_url: data?.image_url ?? undefined,
    },
  });

  // Handle Submiting of form to action
  const submit = useSubmit();
  const onSubmit = useCallback(
    form.handleSubmit((inputData) => {
      const formData = new FormData();
      Object.entries(inputData).forEach(([Key, value]) => {
        formData.append(Key, value);
      });

      formData.append("user_id", user_id ?? "undefined");
      if (mode === "edit" && data) formData.append("id", String(data.id));

      submit(formData, {
        action: mode === "create" ? "/blogs/create" : `/blogs/edit/${data?.id}`,
        method: mode === "create" ? "POST" : "PUT",
      });
    }),
    [form],
  );

  // Handle uploading of image
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const isLoading = navigation.state !== "idle";
  const [files, setFiles] = useState<File[]>([]);
  const client = getSupabaseBrowserClient();

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

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
          form.setValue("image_url", data.publicUrl);

          onSuccess(file);
        });

        // await Promise.all(uploadPromises);
        toast.promise(Promise.all(uploadPromises), {
          loading: "Uploading image...",
          success: "Successfully uploaded image!",
          error: "Failed to upload image",
        });
        setIsUploading((state) => (state = false));
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [],
  );

  return (
    <div className="">
      {error && <div>{error.message}</div>}
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Title..."
                  className="max-w-93.75"
                  disabled={navigation.state === "loading" || isUploading}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="image_url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Image</FieldLabel>
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  maxSize={5 * 2048 * 2048}
                  onFileReject={onFileReject}
                  value={files}
                  onValueChange={setFiles}
                  onUpload={onUpload}
                  className=""
                  disabled={isLoading || isUploading}
                >
                  {files.length === 0 && (
                    <FileUploadDropzone>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                          <UploadIcon className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">
                          Drag & drop file here
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Or click to browse (max 1 file)
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-fit"
                        >
                          Browse files
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>
                  )}
                  <FileUploadList>
                    {files.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemProgress />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <XIcon />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel>Body</FieldLabel>
                <Textarea
                  {...field}
                  className="h-87.5"
                  disabled={isLoading || isUploading}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
            <Button
              type="reset"
              variant="outline"
              className="w-full md:w-fit"
              disabled={isLoading || isUploading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full md:w-fit"
            >
              {isLoading && <Loader2Icon className="animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
