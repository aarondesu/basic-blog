import type { Editor } from "@tiptap/react";
import type { editorStateSelector } from "./state";
import {
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
  UnderlineIcon,
  YoutubeIcon,
} from "lucide-react";
import { useUploadImage } from "~/hooks/use-uplaod-image";

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
  },
  {
    icon: ItalicIcon,
    onClick: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    icon: UnderlineIcon,
    onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
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
      const { onUpload } = useUploadImage({
        onUploadSuccess: (url) => {
          editor.chain().focus().setImage({ src: url }).run();
        },
      });

      const url = window.prompt("Enter image url");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
  // {
  //   icon: YoutubeIcon,
  //   onClick: (editor) => {
  //     const url = window.prompt("Enter youtube video url");
  //     if (url) {
  //       editor.chain().focus().setYoutubeVideo({ src: url }).run();
  //     }
  //   },
  // },
];

/**
 * All toolbar actions, grouped by category. This is used to render the toolbar buttons in the BlogEditorToolbar component.
 */
export const allActions: ToolbarButton[][] = [
  textFormatActions,
  headingActions,
  listActions,
  otherActions,
  externalActions,
];
