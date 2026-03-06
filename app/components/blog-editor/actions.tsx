import type { Editor } from "@tiptap/react";
import type { editorStateSelector } from "./state";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
  YoutubeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "~/hooks/use-upload-image";

/**
 * Toolbar for the blog editor, with buttons for text formatting, headings, lists, etc. It uses the editor state to determine which buttons are active.
 */
type ToolbarButton = {
  icon: React.JSX.ElementType;
  onClick: (editor: Editor) => void;
  isActive?: (editorState: ReturnType<typeof editorStateSelector>) => boolean;
};

/**
 * Format actions
 */
export const textFormatActions: ToolbarButton[] = [
  {
    icon: BoldIcon,
    onClick: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (state) => state.isBold,
  },
  {
    icon: ItalicIcon,
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (state) => state.isItalic,
  },
  {
    icon: UnderlineIcon,
    onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (state) => state.isUnderline,
  },
  {
    icon: StrikethroughIcon,
    onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (state) => state.isStrikethrough,
  },
];

/**
 * Heading actions
 */
export const headingActions: ToolbarButton[] = [
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
];

// Lists
export const listActions: ToolbarButton[] = [
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
];
// Horizontal rule, blockquote, code block, etc.
export const otherActions: ToolbarButton[] = [
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
];

export const externalActions: ToolbarButton[] = [
  {
    icon: LinkIcon,
    onClick: (editor) => {
      const url = window.prompt("Enter link url");
      if (url) {
        editor.chain().focus().toggleLink({ href: url }).run();
      }
    },
  },
  {
    icon: ImagePlusIcon,
    onClick: (editor) => {
      // Create input element with file as it's type to accept image files
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = false;

      input.onchange = async () => {
        const imageFile = input.files?.[0]; // Get selected image file
        if (!imageFile) return;

        editor.setEditable(false);
        toast.promise(uploadImage(imageFile), {
          loading: "Uploading image to server...",
          success: (result) => {
            // Add image to editor
            editor.chain().focus().setImage({ src: result }).run();

            return "Successfully uploaded image!";
          },
          error: (error) => error.message,
          finally: () => editor.setEditable(true),
        });
      };

      // Trigger click command
      input.click();
      return;
    },
  },
  {
    icon: YoutubeIcon,
    onClick: (editor) => {
      const url = window.prompt("Enter youtube video url");
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    },
  },
];

export const alignActions: ToolbarButton[] = [
  {
    icon: AlignLeftIcon,
    onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
  },
  {
    icon: AlignCenterIcon,
    onClick: (editor) => editor.chain().focus().setTextAlign("center").run(),
  },
  {
    icon: AlignRightIcon,
    onClick: (editor) => editor.chain().focus().setTextAlign("right").run(),
  },
  {
    icon: AlignJustifyIcon,
    onClick: (editor) => editor.chain().focus().setTextAlign("justify").run(),
  },
];

/**
 * All toolbar actions, grouped by category. This is used to render the toolbar buttons in the BlogEditorToolbar component.
 */
export const allActions: ToolbarButton[][] = [
  textFormatActions,
  headingActions,
  alignActions,
  listActions,
  otherActions,
  externalActions,
];
