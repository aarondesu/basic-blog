import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import type { AnyExtension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";

import { getSupabaseBrowserClient } from "~/lib/supabase";
import { randString } from "~/lib/utils";
import { toast } from "sonner";

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
        const client = getSupabaseBrowserClient();
        const insertResult = await client.storage
          .from("images")
          .upload(`${randString()}${randString()}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (insertResult.error) {
          toast.error("Failed to insert image", {
            description: insertResult.error.message,
          });
          return null;
        }

        const result = await client.storage
          .from("images")
          .getPublicUrl(insertResult.data?.path ?? "");

        editor
          .chain()
          .insertContentAt(pos, {
            type: "image",
            attrs: {
              src: result.data.publicUrl,
            },
          })
          .focus()
          .run();
      });
    },
    onPaste(editor, files, pasteContent) {},
  }),
];
