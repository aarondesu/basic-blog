import { useAppSelector } from "~/redux/hooks";
import {
  FileUpload,
  FileUploadDropzone,
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
import {
  ImageOffIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SendHorizontalIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useUploadImage } from "~/hooks/use-uplaod-image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useConfirmationDialog } from "~/context/use-confirmation-dialog";

type Args = {
  blog_id?: number;
  mode?: "create" | "edit";
  comment_id?: number;
  onSuccess?: () => void;
  comment?: Partial<CommentInput>;
};

export default function CommentInput({
  blog_id,
  mode = "create",
  comment_id,
  onSuccess,
  comment,
}: Args) {
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();

  const isLoading = fetcher.state !== "idle";

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentInputSchema),
    defaultValues: {
      body: comment?.body ?? "",
      user_id: comment?.user_id ?? user_id,
      blog_id: comment?.blog_id ?? blog_id,
      image_url: comment?.image_url,
    },
  });

  const { body, image_url } = form.watch(); // Used for disabling submit button if comment body is missing

  // Handle uploading of images
  const [files, setFiles] = useState<File[]>([]);
  const { onUpload, isUploading, imageUrl } = useUploadImage();

  // Handle submitting of form
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    data.image_url = imageUrl ?? data.image_url;

    Object.entries(data).forEach(([key, value]) => {
      if (!value) return;
      formData.append(key, value as string);
    });

    // Submit to comment action route
    if (mode === "create") {
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
            onSuccess?.();
            return "Successfully posted comment!";
          },
        },
      );
    } else if (mode === "edit") {
      toast.promise(
        fetcher.submit(formData, {
          action: `/comments/update/${comment_id}`,
          method: "PUT",
        }),
        {
          loading: "Posting comment...",
          success: () => {
            form.resetField("body"); // Clear the text area after posting
            form.resetField("image_url");
            setFiles([]);
            onSuccess?.();
            return "Successfully updated comment!";
          },
        },
      );
    }
  });

  // Handle file reject
  const onReject = useCallback((file: File, message: string) => {
    toast.message(message);
  }, []);

  // Handle image removal (only on edit)
  const { createDialog } = useConfirmationDialog();
  const onRemoveImage = useCallback(() => {
    createDialog({
      title: "Delete Image",
      description:
        "Are you sure you want to remove the image? Action is irreversible.",
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        form.setValue("image_url", undefined);
      },
    });
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
      disabled={isUploading}
    >
      <fetcher.Form onSubmit={onSubmit}>
        <div className="flex flex-col">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="grid w-full gap-6">
                  <InputGroup className="bg-white">
                    <InputGroupTextarea
                      {...field}
                      placeholder="Add your comment here"
                      disabled={isLoading || isUploading}
                    />
                    {mode === "edit" && form.getValues("image_url") && (
                      <InputGroupAddon align="block-start">
                        <img
                          src={form.getValues("image_url")}
                          className=" max-w-full md:max-w-xl object-cover"
                        />
                      </InputGroupAddon>
                    )}
                    {files.length !== 0 && (
                      <InputGroupAddon align="block-start">
                        <FileUploadList orientation="horizontal">
                          {files.map((file, index) => (
                            <FileUploadItem key={index} value={file}>
                              <FileUploadItemPreview className="size-25 [&>svg:size-5] ">
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
                      </InputGroupAddon>
                    )}
                    <InputGroupAddon
                      align="block-end"
                      className="flex justify-end"
                    >
                      {mode === "edit" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InputGroupButton
                              variant="outline"
                              type="button"
                              size="icon-sm"
                              onClick={onRemoveImage}
                              disabled={!image_url}
                            >
                              <ImageOffIcon />
                            </InputGroupButton>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove image</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <FileUploadTrigger asChild>
                        <InputGroupButton
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          disabled={isLoading || isUploading}
                        >
                          <PaperclipIcon />
                        </InputGroupButton>
                      </FileUploadTrigger>
                      <InputGroupButton
                        type="submit"
                        size="icon-sm"
                        variant="default"
                        disabled={isLoading || isUploading || body.length === 0}
                      >
                        <SendHorizontalIcon />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </Field>
            )}
          />
        </div>
      </fetcher.Form>
    </FileUpload>
  );
}
