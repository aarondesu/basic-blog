import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { useAppSelector } from "~/redux/hooks";
import { useFetcher } from "react-router";
import { useCallback, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { EditableTrigger } from "./ui/editable";
import CommentInput from "./comment-input";
import { Toggle } from "./ui/toggle";
import { toast } from "sonner";

type Args = {
  id: number;
  blog_id: number;
  user_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  user: {
    username: string;
  };
};

export default function Comment(comment: React.PropsWithoutRef<Args>) {
  const [isEdditing, setEditing] = useState<boolean>(false);
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();

  const onDeleteClick = useCallback(() => {
    toast.warning(
      "Are you sure you want to delete the comment? Action is irreversible",
      {
        action: {
          label: "Confirm",
          onClick: () => {
            toast.promise(
              fetcher.submit(null, {
                action: `/comments/delete/${comment.id}`,
                method: "DELETE",
              }),
              {
                loading: "Deleting comment...",
                success: () => {
                  setEditing((editing) => (editing = false));

                  return "Successfully deleted comment!";
                },
              },
            );
          },
        },
      },
    );
  }, []);

  return (
    <div className="flex flex-col gap-3 px-3 py-6 not-first:border-t">
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
            <ButtonGroup className="">
              <Toggle
                type="button"
                variant="default"
                onPressedChange={(p) => setEditing((editing) => (editing = p))}
                pressed={isEdditing}
              >
                <PencilIcon />
              </Toggle>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onDeleteClick}
              >
                <TrashIcon />
              </Button>
            </ButtonGroup>
          )}
        </span>
      </div>
      {comment.image_url && (
        <img src={comment.image_url} className="w-full object-cover md:w-64" />
      )}
      <div className="bg-accent rounded-md p-4">
        {comment.user_id === user_id && isEdditing ? (
          <CommentInput
            blog_id={comment.blog_id}
            mode="edit"
            defaultValue={comment.body}
            comment_id={comment.id}
            onSuccess={() => {
              setEditing((editing) => (editing = false));
            }}
          />
        ) : (
          <p className="text-sm">{comment.body}</p>
        )}
      </div>
    </div>
  );
}
