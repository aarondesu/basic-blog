import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import type { AnyExtension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

/**
 * Helper variable to store all extensions used in the blog editor and other places like content renderer
 */
export const extenstions: AnyExtension[] = [
  StarterKit,
  TextAlign,
  Image,
  Youtube.configure({}),
];
