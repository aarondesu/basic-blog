import ReactMarkdown from "react-markdown";

type Args = {
  content: string;
};

export default function MarkdownRenderer({ content }: Args) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none! prose-code:text-wrap">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
