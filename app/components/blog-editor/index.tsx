import { Mark, PureEditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown, MarkdownManager } from "@tiptap/markdown";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { BoldIcon } from "lucide-react";
import BlogEditorToolbar from "./toolbar";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

type Args = ComponentProps<"textarea"> & {
  onChange?: (markdown: string) => void;
  value?: string;
};

/**
 * WSYWYG editor for creating and editing blogs, using tiptap editor with markdown extension. It also has a floating menu and bubble menu for text formatting.
 * @param param0
 * @returns
 */
export default function BlogEditor({ onChange, value }: Args) {
  // Used to convert string to markdown text for editor when editing a blog, and also to convert editor content to markdown string when creating/updating a blog
  const manager = new MarkdownManager({
    extensions: [StarterKit, Markdown, TextAlign],
  });

  const editor = useEditor({
    extensions: [StarterKit, Markdown, TextAlign],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base focus:outline-none !max-w-none",
      },
    },
    content: manager.parse(value as string),
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getMarkdown());
    },
  });

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
        <PureEditorContent editor={editor} className="p-4" />
      </div>
      {editor && (
        <FloatingMenu editor={editor}>
          <ButtonGroup>
            <Button size="icon">
              <BoldIcon />
            </Button>
          </ButtonGroup>
        </FloatingMenu>
      )}
      {editor && <BubbleMenu editor={editor}>Bubble</BubbleMenu>}
    </>
  );
}
