import { EditorContent, useEditor } from "@tiptap/react";
import { extenstions } from "../extensions";
import { useEffect, type ComponentProps } from "react";
import { cn } from "~/lib/utils";
import CommentEditorToolbar from "./toolbar";
import { CharacterCount } from "@tiptap/extensions";

type Args = ComponentProps<"input"> & {
  value?: string;
  onChange?: (value: string) => void;
  "data-invalid"?: boolean;
};

export default function CommentEditor({
  value,
  onChange,
  name,
  disabled,
  className,
  ...props
}: Args) {
  const editor = useEditor({
    extensions: [
      // CharacterCount.configure({
      //   limit: 3000, // Limits the comment section to only have at 1000 characters at max to avoid spam
      // }),
      ...extenstions,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none !max-w-none",
      },
    },
    content: value && JSON.parse(value ?? ""),
    onUpdate: ({ editor }) => {
      onChange && onChange(JSON.stringify(editor.getJSON()));
    },
  });

  // Clear content if value is blank
  useEffect(() => {
    if (value === "") editor?.commands.clearContent();
  }, [value]);

  // Set the editor to be editable
  useEffect(() => {
    editor?.setOptions({ editable: !disabled });
  }, [disabled]);

  return (
    <div
      data-disabled={disabled}
      className={cn(
        className,
        "border rounded-md bg-background",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        props["data-invalid"] === true &&
          "border-ring ring-destructive/50 ring-[3px]",
      )}
    >
      <CommentEditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        name={name}
        className="p-4"
        disabled={true}
        contentEditable={false}
        {...props}
      />
    </div>
  );
}
