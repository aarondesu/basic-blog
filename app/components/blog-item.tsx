import dayjs from "dayjs";
import { Link } from "react-router";
import type { BlogData } from "~/types";

interface Args {
  blog: {
    author: string | null;
    body: string | null;
    created_at: string | null;
    id: number | null;
    image_url: string | null;
    title: string | null;
    user_id: string | null;
  };
}

export default function BlogItem({ blog }: Args) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {blog.image_url && blog.image_url !== "undefined" && (
          <img src={blog.image_url} className="max-h-50" />
        )}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="font-bold text-2xl">{blog.title}</h1>
            <span className="flex items-start gap-2">
              <p className="text-muted-foreground text-xs">
                {dayjs(blog.created_at).format("MMMM DD, YYYY H:MM:s")}
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                by {blog.author}
              </p>
            </span>
          </div>
          <div>
            <p className="text-sm">{blog.body}...</p>
            <Link
              to={`/blogs/view/${blog.id}`}
              className="underline text-sm"
              reloadDocument
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
