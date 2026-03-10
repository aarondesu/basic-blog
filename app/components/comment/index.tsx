import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { useAppSelector } from "~/redux/hooks";
import { useFetcher } from "react-router";
import { useCallback, useState } from "react";
import CommentInput from "../comment-input";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useConfirmationDialog } from "~/context/use-confirmation-dialog";
import ContentRenderer from "../content-renderer";
import CommentActions from "./actions";
import type { Comment } from "~/types";
import { useIsMobile } from "~/hooks/use-mobile";
import { Drawer, DrawerContent } from "../ui/drawer";

type Args = Partial<Comment> & { user: { username: string } };

export default function Comment(comment: React.PropsWithoutRef<Args>) {
  const [isEditing, setEditing] = useState<boolean>(false);
  const { createDialog } = useConfirmationDialog();
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();
  const isMobile = useIsMobile();

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

  const onEditClick = useCallback(() => {
    if (isMobile) {
    } else {
      if (isEditing) {
        setEditing(false);
      } else {
        setEditing(true);
      }
    }
  }, [isEditing, isMobile]);

  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 px-3 py-6 not-first:border-t ",
        // "hover:bg-accent/30"
      )}
    >
      <Drawer>
        <DrawerContent></DrawerContent>
      </Drawer>
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

          <CommentActions
            comment={comment}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
        </span>
      </div>
      <div className="bg-accent rounded-md p-4">
        {comment.user_id === user_id && isEditing ? (
          <CommentInput
            mode="edit"
            comment={comment}
            onSuccess={() => {
              setEditing((editing) => (editing = false));
            }}
          />
        ) : (
          comment.body && <ContentRenderer content={comment.body} />
        )}
      </div>
    </div>
  );
}
