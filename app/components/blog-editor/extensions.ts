import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import type { AnyExtension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";

import { getSupabaseBrowserClient } from "~/lib/supabase";
import { randString } from "~/lib/utils";
import { toast } from "sonner";
import { uploadImage } from "~/hooks/use-upload-image";

/**
 * Helper variable to store all extensions used in the blog editor and other places like content renderer
 */
export const extenstions: AnyExtension[] = [
  StarterKit,
  TextAlign.configure({
    types: ["paragraph", "heading"],
  }),
  Image.configure({
    allowBase64: true,
    resize: {
      enabled: true,
      directions: ["top", "bottom", "left", "right"],
      minWidth: 64,
      minHeight: 64,
    },
  }),
  Youtube.configure({}),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
    onDrop: (editor, files, pos) => {
      files.forEach(async (file) => {
        const imageUrl = await uploadImage(file);

        editor
          .chain()
          .insertContentAt(pos, {
            type: "image",
            attrs: {
              src: imageUrl,
            },
          })
          .focus()
          .run();
      });
    },
    onPaste(editor, files, pasteContent) {},
  }),
];
