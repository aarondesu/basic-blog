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
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAppSelector } from "~/redux/hooks";

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  // Get the page params
  const current_page = Number(params.page ?? 1);
  const per_page = 5; // Temp, will change later

  // Load the data
  const client = getSupabaseServerClient(request);
  const result = await client
    .from("blogs_view")
    .select("*", { count: "exact" })
    .range((current_page - 1) * per_page, current_page * per_page - 1)
    .order("created_at", { ascending: false });

  // Throw error if past bounds
  if (result.data === null) {
    throw data(null, { status: 404 });
  }

  return data({
    current_page: current_page,
    last_page: Math.ceil((result.count ?? 1) / per_page),
    blogs: result.data,
  });
}

export function HydrateFallback() {
  return (
    <div className="container mx-auto mt-4 space-y-4 px-4 md:px-0">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-50 w-full sm:w-50" />
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
  const { roles } = useAppSelector((state) => state.auth);

  return (
    <div className="container mx-auto mt-4 space-y-4 px-4 md:px-0">
      <div className="flex justify-between">
        <h2 className="text-4xl font-extrabold">Blogs</h2>
        {roles.includes("Admin") && (
          <Button type="button" variant="outline" asChild>
            <Link to="/blogs/create">
              <PlusIcon />
              Create
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {blogs && blogs.length === 0 && <h3>No blogs to display</h3>}
        {blogs &&
          blogs.map((blog, index) => (
            <div key={index} className="border rounded-md p-4">
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
                    <p className="text-sm">{blog.short_description}...</p>
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
