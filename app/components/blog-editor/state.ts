import type { Editor, EditorStateSnapshot } from "@tiptap/react";

export function editorStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    // Lists
    isOrderedList: ctx.editor.isActive("orderedList"),
    isBulletList: ctx.editor.isActive("bulletList"),
    // Blockquote
    isBlockquote: ctx.editor.isActive("blockquote"),
    // Codeblock
    isCodeBlock: ctx.editor.isActive("codeBlock"),
  };
}
