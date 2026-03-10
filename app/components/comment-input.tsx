import { useAppSelector } from "~/redux/hooks";
import { Controller, useForm } from "react-hook-form";
import type { Comment, CommentInput } from "~/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentInputSchema } from "~/schemas";
import { useFetcher } from "react-router";
import { Field, FieldError } from "./ui/field";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useConfirmationDialog } from "~/context/use-confirmation-dialog";
import CommentEditor from "./blog-editor/comment";

type Args = {
  blog_id?: number;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  comment?: Partial<Comment>;
};

export default function CommentInput({
  blog_id,
  mode = "create",
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
    },
  });

  const { body } = form.watch(); // Used for disabling submit button if comment body is missing

  // Handle uploading of images
  const [files, setFiles] = useState<File[]>([]);

  // Handle submitting of form
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

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

            setFiles([]);
            onSuccess?.();
            return "Successfully posted comment!";
          },
        },
      );
    } else if (mode === "edit") {
      toast.promise(
        fetcher.submit(formData, {
          action: `/comments/update/${comment?.id}`,
          method: "PUT",
        }),
        {
          loading: "Posting comment...",
          success: () => {
            form.resetField("body"); // Clear the text area after posting

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

  return (
    <fetcher.Form onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <Controller
          name="body"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <CommentEditor {...field} />
              {/* {fieldState.error && <FieldError errors={[fieldState.error]} />} */}
            </Field>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="icon-sm"
            disabled={body === "" || isLoading}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}
