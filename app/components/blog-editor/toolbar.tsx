import {
  Editor,
  useEditorState,
  type EditorStateSnapshot,
} from "@tiptap/react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  UnderlineIcon,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { editorStateSelector } from "./state";

/**
 * Toolbar for the blog editor, with buttons for text formatting, headings, lists, etc. It uses the editor state to determine which buttons are active.
 */
type ToolbarButton = {
  icon: React.JSX.ElementType;
  onClick: (editor: Editor) => void;
  isActive?: (editorState: ReturnType<typeof editorStateSelector>) => boolean;
};

const toolbar: ToolbarButton[][] = [
  // Text formatting buttons
  [
    {
      icon: BoldIcon,
      onClick: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: ItalicIcon,
      onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: UnderlineIcon,
      onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
  ],
  // Headings
  [
    {
      icon: Heading1Icon,
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2Icon,
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: Heading3Icon,
      onClick: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  // Lists
  [
    {
      icon: ListOrderedIcon,
      onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (state) => state.isOrderedList,
    },
    {
      icon: ListIcon,
      onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (state) => state.isBulletList,
    },
  ],
  // Horizontal rule, blockquote, code block, etc.
  [
    {
      icon: MinusIcon,
      onClick: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: QuoteIcon,
      onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (state) => state.isBlockquote,
    },
    {
      icon: CodeIcon,
      onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (state) => state.isCodeBlock,
    },
  ],
];

export default function BlogEditorToolbar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  const editorState = useEditorState({
    editor: editor,
    selector: editorStateSelector,
  });

  return (
    <span className="flex flex-wrap gap-2">
      {toolbar.map((category, index) => (
        <ButtonGroup key={index}>
          {category.map((button, index) => {
            if (button.isActive) {
              return (
                <Toggle
                  type="button"
                  key={index}
                  variant="outline"
                  size="sm"
                  pressed={
                    button.isActive ? button.isActive(editorState) : false
                  }
                  onClick={() => button.onClick(editor)}
                >
                  <button.icon />
                </Toggle>
              );
            } else {
              return (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => button.onClick(editor)}
                >
                  <button.icon />
                </Button>
              );
            }
          })}
        </ButtonGroup>
      ))}
    </span>
  );
}
