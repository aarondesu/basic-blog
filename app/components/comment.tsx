import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { useAppSelector } from "~/redux/hooks";
import { useFetcher } from "react-router";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import CommentInput from "./comment-input";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useConfirmationDialog } from "~/context/use-confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ContentRenderer from "./content-renderer";

type Args = {
  id: number;
  blog_id: number;
  user_id: string;
  body: string;
  image_url: string | null | undefined;
  created_at: string;
  user: {
    username: string;
  };
};

export default function Comment(comment: React.PropsWithoutRef<Args>) {
  const [isEditing, setEditing] = useState<boolean>(false);
  const { createDialog } = useConfirmationDialog();
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();

  const onDeleteClick = useCallback(() => {
    createDialog({
      title: "Delete Comment",
      description:
        "Are you sure you want to delete this comment? Action is irreversible",
      onConfirm: async () => {
        await fetcher.submit(null, {
          action: `/comments/delete/${comment.id}`,
          method: "DELETE",
        });

        toast.success("Successfully deleted comment!");
      },
    });
  }, []);

  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 px-3 py-6 not-first:border-t ",
        // "hover:bg-accent/30"
      )}
    >
      <div className="flex gap-2 items-center">
        <Avatar size="sm">
          <AvatarImage src={defaultAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="flex flex-1 items-center justify-between">
          <span className="flex gap-2.5 text-muted-foreground text-sm">
            <span>
              by <b>{comment.user.username}</b>
            </span>
            <span>
              on {dayjs(comment.created_at).format("MMMM DD, YYYY HH:mm:ss")}
            </span>
          </span>
          {comment.user_id === user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      if (isEditing) {
                        createDialog({
                          title: "Discard Changes",
                          description:
                            "Are you sure you want to discard the chanags made?",
                          onConfirm: () => {
                            setEditing((editing) => (editing = !isEditing));
                          },
                        });
                      } else {
                        setEditing((editing) => (editing = !isEditing));
                      }
                    }}
                  >
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDeleteClick}>
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </span>
      </div>
      <div className="bg-accent rounded-md p-4">
        {comment.user_id === user_id && isEditing ? (
          <CommentInput
            mode="edit"
            comment_id={comment.id}
            comment={{
              blog_id: comment.blog_id,
              body: comment.body,
              user_id: comment.user_id,
            }}
            onSuccess={() => {
              setEditing((editing) => (editing = false));
            }}
          />
        ) : (
          <ContentRenderer content={comment.body} />
        )}
      </div>
    </div>
  );
}
