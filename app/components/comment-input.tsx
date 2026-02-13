import { useAppSelector } from "~/redux/hooks";
import {
  FileUpload,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./ui/file-upload";
import { Controller, useForm } from "react-hook-form";
import type { CommentInput } from "~/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentInputSchema } from "~/schemas";
import { useFetcher } from "react-router";
import { Textarea } from "./ui/textarea";
import { Field } from "./ui/field";
import { Button } from "./ui/button";
import { PaperclipIcon, SendHorizonalIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useUploadImage } from "~/lib/utils";

type Args = {
  blog_id: number;
};

export default function CommentInput({ blog_id }: Args) {
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();

  const isLoading = fetcher.state !== "idle";

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentInputSchema),
    defaultValues: {
      body: "",
      user_id: user_id,
      blog_id: blog_id,
    },
  });

  const { body } = form.watch(); // Used for disabling submit button if comment body is missing

  // Handle uploading of images
  const [files, setFiles] = useState<File[]>([]);
  const { onUpload, isUploading, imageUrl } = useUploadImage();

  // Handle submitting of form
  const onSubmit = useCallback(
    form.handleSubmit((data) => {
      const formData = new FormData();
      data.image_url = imageUrl;
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Submit to comment action route
      // submit(formData, { action: "/comments/create", method: "POST" });
      toast.promise(
        fetcher.submit(formData, {
          action: "/comments/create",
          method: "POST",
        }),
        {
          loading: "Posting comment...",
          success: () => {
            form.resetField("body"); // Clear the text area after posting
            form.resetField("image_url");
            setFiles([]);
            return "Successfully posted comment!";
          },
        },
      );
    }),
    [form, imageUrl],
  );

  // Handle file reject
  const onReject = useCallback((file: File, message: string) => {
    toast.message(message);
  }, []);

  return (
    <FileUpload
      accept="image/*"
      value={files}
      onValueChange={setFiles}
      maxSize={10 * 1024 * 1024}
      maxFiles={1}
      onFileReject={onReject}
      onUpload={onUpload}
    >
      <fetcher.Form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 p-3 rounded-md border border-input outline-none shadow-md focus-within:ring-1 focus-within:ring-ring/50">
          <FileUploadList orientation="horizontal">
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file}>
                <FileUploadItemPreview className="size-8 [&>svg:size-5]">
                  <FileUploadItemProgress variant="fill" />
                </FileUploadItemPreview>
                <FileUploadItemDelete asChild>
                  <Button
                    variant="secondary"
                    type="button"
                    size="icon-sm"
                    className="absolute -top-1 -right-1 size-4 shrink-0 cursor cursor-pointer rounded-full "
                  >
                    <XIcon className="size-2.5" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  placeholder="Add your comment here"
                  className="field-sizing-content w-full min-h-10 resize-none border-0 bg-transparent p-0 focus-visible:ring-0 dark:bg-transparent shadow-none focus:ring-0 focus:border-none"
                  disabled={isLoading}
                />
              </Field>
            )}
          />
          <div className="flex gap-2 justify-end">
            <FileUploadTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                disabled={isLoading || isUploading}
              >
                <PaperclipIcon />
              </Button>
            </FileUploadTrigger>
            <Button
              type="submit"
              size="icon-sm"
              variant="secondary"
              disabled={isLoading || body.length === 0 || isUploading}
            >
              <SendHorizonalIcon />
            </Button>
          </div>
        </div>
      </fetcher.Form>
    </FileUpload>
  );
}
