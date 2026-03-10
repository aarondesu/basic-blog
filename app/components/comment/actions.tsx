import { EllipsisIcon, FlagIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { Comment } from "~/types";
import { useAppSelector } from "~/redux/hooks";

type Args = {
  comment: Partial<Comment>;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CommentActions({ comment, onEdit, onDelete }: Args) {
  const { user_id } = useAppSelector((state) => state.auth);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {comment.user_id === user_id && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => toast.info("Not yet implemented")}
            className="text-red-600"
          >
            <FlagIcon />
            Report
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
