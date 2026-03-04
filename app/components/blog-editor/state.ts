import type { Editor, EditorStateSnapshot } from "@tiptap/react";

export function editorStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive("bold"),
    isItalic: ctx.editor.isActive("italic"),
    isUnderline: ctx.editor.isActive("underline"),

    // Lists
    isOrderedList: ctx.editor.isActive("orderedList"),
    isBulletList: ctx.editor.isActive("bulletList"),
    // Blockquote
    isBlockquote: ctx.editor.isActive("blockquote"),
    // Codeblock
    isCodeBlock: ctx.editor.isActive("codeBlock"),
  };
}
