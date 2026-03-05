import { generateHTML } from "@tiptap/html";
import { extenstions } from "./blog-editor/extensions";

export default function ContentRenderer({ content }: { content: string }) {
  return (
    <article
      className="prose prose-sm sm:prose-base focus:outline-none max-w-none!"
      dangerouslySetInnerHTML={{
        __html: generateHTML(JSON.parse(content), extenstions),
      }}
    />
  );
}
