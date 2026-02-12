import { getSupabaseServerClient } from "~/lib/supabase";
import type { Route } from "./+types/blogs.($page)";
import { data, Link } from "react-router";
import dayjs from "dayjs";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  // Get the page params
  const page = Number(params.page ?? 1);
  const per_page = 5; // Temp, will change later

  // Load the data
  const client = getSupabaseServerClient(request);
  const result = await client
    .from("blogs_view")
    .select("*", { count: "exact" })
    .range((page - 1) * per_page, page * per_page - 1);

  // Throw error if past bounds
  if (result.data === null) {
    throw data(null, { status: 404 });
  }

  return data({
    current_page: page,
    last_page: Math.ceil((result.count ?? 1) / per_page),
    blogs: result.data,
  });
}

export function HydrateFallback() {
  return (
    <div className="container mx-auto mt-4 space-y-4">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex gap-4">
              <Skeleton className="h-50 w-50" />
              <div className="flex-1">
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-6 w-75" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div>
                  <Skeleton className="h-30 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Blogs" },
    {
      name: "description",
      content: "View all blogs",
    },
  ];
}

export default function Blogs({ loaderData }: Route.ComponentProps) {
  const { blogs, current_page, last_page } = loaderData;

  return (
    <div className="container mx-auto mt-4 space-y-4">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
      <div className="space-y-4">
        {blogs &&
          blogs.map((blog, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex gap-4">
                {blog.image_url && (
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
                    <p className="text-sm">{blog.short_description}...</p>
                    <Link
                      to={`/blogs/view/${blog.id}`}
                      className="underline text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Pagination>
        <PaginationContent>
          {[...new Array(last_page)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={`/blogs/${index + 1}`}
                isActive={current_page - 1 === index}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
