import type { PostgrestError } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigation, useSubmit } from "react-router";
import { useAppSelector } from "~/redux/hooks";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "../ui/file-upload";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getFilenameFromUrl } from "~/lib/utils";
import { useUploadImage } from "~/hooks/use-upload-image";
import { blogSchema } from "~/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useConfirmationDialog } from "~/context/use-confirmation-dialog";
import BlogEditor from "../blog-editor/blog";
import { generateText } from "@tiptap/core";
import { extenstions } from "../blog-editor/extensions";

type Args = {
  mode: "create" | "edit";
  blog?: {
    body: string;
    created_at: string;
    id: number;
    image_url: string | null;
    title: string;
    updated_at: string | null;
    user_id: string;
  };
  error?: PostgrestError;
};

/**
 * Reusable form for both creating and editing the blog
 * @param param0
 * @returns
 */
export default function BlogForm({ mode, blog, error }: Args) {
  const { user_id } = useAppSelector((state) => state.auth);
  const { createDialog } = useConfirmationDialog();

  const navigation = useNavigation();
  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      body: blog?.body ?? "",
      image_url: blog?.image_url ?? undefined,
      user_id: blog?.user_id,
    },
  });
  const { image_url } = form.watch();

  // Set user id if user ID is not null
  useEffect(() => {
    if (user_id) {
      form.setValue("user_id", user_id);
    }
  }, [user_id]);

  const isLoading = navigation.state !== "idle";

  // Handle uploading of image
  const { isUploading, onUpload } = useUploadImage({
    onUploadSuccess: (image_url) => {
      form.setValue("image_url", image_url);
    },
  });
  const [files, setFiles] = useState<File[]>([]);

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // Handle Submiting of form to action
  const submit = useSubmit();
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    // Generate short description from body
    formData.append(
      "short_description",
      generateText(JSON.parse(data.body), extenstions).slice(0, 300) + "...",
    );
    Object.entries(data).forEach(([key, value]) => {
      if (!value) return;
      formData.append(key, String(value));
    });

    if (mode === "edit" && blog) formData.append("id", String(blog.id));

    submit(formData, {
      action: mode === "create" ? "/blogs/create" : `/blogs/edit/${blog?.id}`,
      method: mode === "create" ? "POST" : "PUT",
    });
  });

  // Handle deletion of image
  const onDelete = useCallback(() => {
    if (image_url) {
      form.setValue("image_url", undefined);
    }
  }, [form, image_url]);

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
                <div className="flex items-center justify-between">
                  <FieldLabel>Image</FieldLabel>
                </div>
                {mode === "edit" &&
                image_url &&
                blog?.image_url &&
                blog.image_url === image_url ? (
                  <div className="flex p-2.5 border items-center rounded-md justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog.image_url}
                        className="w-25 h-25 object-cover"
                      />
                      <span className="flex flex-col gap-1">
                        <p className="font-bold text-sm">
                          {getFilenameFromUrl(blog.image_url)}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Current Image
                        </p>
                      </span>
                    </div>
                    <Button
                      className=""
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        createDialog({
                          title: "Remove Image",
                          description:
                            "Are you sure you want to remove the image? Action is irreversible.",
                          onConfirm: async () => {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000),
                            );

                            onDelete();
                          },
                        });
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                ) : (
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
                          <FileUploadItemPreview className="size-25" />
                          <FileUploadItemMetadata />
                          <FileUploadItemDelete asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => {
                                form.setValue("image_url", undefined);
                              }}
                            >
                              <XIcon />
                            </Button>
                          </FileUploadItemDelete>
                        </FileUploadItem>
                      ))}
                    </FileUploadList>
                  </FileUpload>
                )}

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
                <BlogEditor {...field} />
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
