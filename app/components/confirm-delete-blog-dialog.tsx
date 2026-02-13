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
import { Form, useNavigation, useSubmit } from "react-router";
import { Loader2Icon } from "lucide-react";

type Args = {
  children: React.ReactNode;
  id: number;
  title: string;
};

export default function ConfirmDeleteBlogDialog({ children, id, title }: Args) {
  const [check, setCheck] = useState<string>("");
  const navigation = useNavigation();

  const submit = useSubmit();
  const onSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("id", String(id));

    submit(formData, { action: `/blogs/delete`, method: "DELETE" });
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete blog</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
