import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import type React from "react";
import { Input } from "./ui/input";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { useNavigation, useSubmit } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";

type Args = {
  children: React.ReactNode;
  id: number;
  title: string;
};

function DeleteDialogForm({ id, title }: { id: number; title: string }) {
  const [check, setCheck] = useState<string>("");
  const navigation = useNavigation();

  const submit = useSubmit();
  const onSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("id", String(id));

    submit(formData, { action: `/blogs/delete`, method: "DELETE" });
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="text-sm space-y-2">
        <p>This will permanently delete this blog and it's comments.</p>
        <p className="">
          Type <b>{title}</b> to confirm.
        </p>

        <Input
          type="text"
          value={check}
          onChange={(e) => setCheck(e.target.value)}
        />
      </div>
      <div className="flex">
        <Button
          className="w-full"
          disabled={check !== title || navigation.state !== "idle"}
          type="submit"
        >
          {navigation.state !== "idle" && (
            <Loader2Icon className="animate-spin" />
          )}
          Confirm
        </Button>
      </div>
    </form>
  );
}

/**
 * Confirmation dialog
 * TODO: Add mobile dialog
 * @param param0
 * @returns
 */
export default function ConfirmDeleteBlogDialog({ children, id, title }: Args) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="data-[vaul-drawer-direction=bottom]:min-h-[50vh] data-[vaul-drawer-direction=top]:min-h-[50vh]">
        <DialogHeader>
          <DialogTitle>Delete blog</DialogTitle>
        </DialogHeader>
        <DeleteDialogForm id={id} title={title} />
      </DialogContent>
    </Dialog>
  );
}
