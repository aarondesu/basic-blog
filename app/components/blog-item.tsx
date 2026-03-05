import dayjs from "dayjs";
import { MessageCircleIcon } from "lucide-react";
import { Link } from "react-router";

interface Args {
  blog: {
    author: string | null;
    comments: number | null;
    created_at: string | null;
    id: number | null;
    image_url: string | null;
    short_description: string | null;
    title: string | null;
    updated_at: string | null;
    user_id: string | null;
  };
}

export default function BlogItem({ blog }: Args) {
  const generateText = blog.short_description ?? "";

  return (
    <div className="border rounded-md hover:bg-accent">
      <Link to={`/blogs/view/${blog.id}`} className="text-sm">
        <div className="flex flex-col md:flex-row gap-4 p-4 ">
          {blog.image_url && blog.image_url !== "undefined" && (
            <img src={blog.image_url} className="max-h-50" />
          )}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-2xl line-clamp-1">
                  {blog.title}
                </h3>
                <span className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                  <MessageCircleIcon className="size-3.5" /> {blog.comments}
                </span>
              </div>
              <span className="flex items-start gap-2">
                <p className="text-muted-foreground text-xs">
                  {dayjs(blog.created_at).format("MMMM DD, YYYY H:MM:s")}
                </p>
                <p className="text-muted-foreground text-xs font-medium">
                  by {blog.author}
                </p>
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-sm">{generateText}</p>
              <p className="underline">Read More</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
