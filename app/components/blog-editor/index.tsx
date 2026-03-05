import { PureEditorContent, useEditor } from "@tiptap/react";
import BlogEditorToolbar from "./toolbar";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { extenstions } from "./extensions";

type Args = ComponentProps<"textarea"> & {
  onChange?: (markdown: string) => void;
  value?: string;
};

/**
 * WSYWYG editor for creating and editing blogs, using tiptap editor with markdown extension. It also has a floating menu and bubble menu for text formatting.
 * @param param0
 * @returns
 */
export default function BlogEditor({ onChange, value, disabled, name }: Args) {
  const editor = useEditor({
    extensions: extenstions,
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

  if (!editor) return null;

  return (
    <>
      <div
        className={cn(
          "border space-y-4 placeholder:text-muted-foreground rounded-md",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        )}
      >
        <div className="border-b p-2">
          <BlogEditorToolbar editor={editor} />
        </div>
        <PureEditorContent
          editor={editor}
          className="p-4 min-h-75"
          disabled={disabled}
          name={name}
        />
      </div>
      {/* {editor && (
        <FloatingMenu editor={editor}>
          <ButtonGroup>
            <Button size="icon">
              <BoldIcon />
            </Button>
          </ButtonGroup>
        </FloatingMenu>
      )}
      {editor && <BubbleMenu editor={editor}>Bubble</BubbleMenu>} */}
    </>
  );
}
