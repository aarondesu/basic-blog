import type { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation, useSubmit } from "react-router";
import { useAppSelector } from "~/redux/hooks";
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
} from "../ui/file-upload";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useUploadImage } from "~/lib/utils";
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
      user_id: data?.user_id,
    },
  });

  // Set user id if user ID is not null
  useEffect(() => {
    if (user_id) {
      form.setValue("user_id", user_id);
    }
  }, [user_id]);

  const isLoading = navigation.state !== "idle";

  // Handle uploading of image
  const { imageUrl, isUploading, onUpload } = useUploadImage();
  const [files, setFiles] = useState<File[]>([]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // Handle Submiting of form to action
  const submit = useSubmit();
  const onSubmit = form.handleSubmit((inputData) => {
    const formData = new FormData();
    if (imageUrl) inputData.image_url = imageUrl;
    Object.entries(inputData).forEach(([Key, value]) => {
      if (!value) return;

      formData.append(Key, value);
    });

    if (mode === "edit" && data) formData.append("id", String(data.id));

    submit(formData, {
      action: mode === "create" ? "/blogs/create" : `/blogs/edit/${data?.id}`,
      method: mode === "create" ? "POST" : "PUT",
    });
  });

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
                  maxSize={10 * 1024 * 1024}
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
