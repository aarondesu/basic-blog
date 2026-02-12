import {
  getSupabaseBrowserClient,
  getSupabaseServerClient,
} from "~/lib/supabase";
import type { Route } from "./+types/blogs_.view.$id";
import { data } from "react-router";
import dayjs from "dayjs";

export async function loader({ request, params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  const result = await client
    .from("view_blog_with_username")
    .select("*")
    .eq("id", Number(params.id))
    .range(0, 1);

  // Check if no blog is found
  if (result.data && result.data.length === 0) {
    throw data(null, { status: 404 });
  }

  return data({
    blog: result.data?.at(0),
  });
}

export function HydrateFallback() {
  return <div className="container mx-auto">Test</div>;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { blog } = loaderData;

  return [
    { title: `myBlog | ${blog?.title ?? "Loading..."}` },
    {
      name: "description",
      content: "test",
    },
  ];
}

export default function ViewBlog({ loaderData }: Route.ComponentProps) {
  const { blog } = loaderData;

  return (
    <div className="container mx-auto space-y-6 my-4">
      <div className="space-y-4">
        <div className="">
          <h1 className="text-3xl font-black">{blog?.title}</h1>
          <span className="flex gap-2">
            <p className="font-medium text-muted-foreground text-sm">
              {dayjs(blog?.created_at).format("MMM DD, YYYY HH:mm:ss")}
            </p>
            <p className="text-sm text-muted-foreground font-bold">
              by {blog?.author}
            </p>
          </span>
        </div>
        {blog?.image_url && <img src={blog.image_url} />}
        <div>
          <p className="whitespace-pre-wrap">{blog?.body}</p>
        </div>
      </div>
      <div className="border-t pt-3">
        <h4 className="font-bold text-xl">Comments (0)</h4>
      </div>
    </div>
  );
}
