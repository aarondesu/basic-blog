import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { useAppSelector } from "~/redux/hooks";
import { useFetcher } from "react-router";
import { useCallback } from "react";

type Args = {
  id: number;
  user_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  user: {
    username: string;
  };
};

export default function Comment(comment: React.PropsWithoutRef<Args>) {
  const { user_id } = useAppSelector((state) => state.auth);
  const fetcher = useFetcher();

  const onDeleteClick = useCallback(() => {
    fetcher.submit(null, { action: `/comments/delete` });
  }, []);

  return (
    <div className="flex flex-col gap-3 px-3 py-6 not-first:border-t">
      <div className="flex gap-2 items-center">
        <Avatar size="sm">
          <AvatarImage src={defaultAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className="flex gap-2.5 text-muted-foreground text-sm">
          <span>
            by <b>{comment.user.username}</b>
          </span>
          <span>
            on {dayjs(comment.created_at).format("MMMM DD, YYYY HH:mm:ss")}
          </span>
        </span>
        {/* TODO: add delete and edit comment */}
        {/* {user_id === comment.user_id && (
          <div className="flex flex-1 justify-end">
            <Button type="button" variant="outline" size="icon-xs">
              <TrashIcon />
            </Button>
          </div>
        )} */}
      </div>
      {comment.image_url && (
        <img src={comment.image_url} className="w-full object-cover md:w-64" />
      )}
      <div className="bg-accent rounded-md p-4">
        <p className="text-sm">{comment.body}</p>
      </div>
    </div>
  );
}
