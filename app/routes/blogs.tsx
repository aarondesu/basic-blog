import { getSupabaseServerClient } from "~/lib/supabase";
import type { Route } from "./+types/blogs";
import { data } from "react-router";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // Load the data
  const client = getSupabaseServerClient(request);
  const blogs = await client.from("blogs_view").select("*");

  return data(blogs);
}

export function HydrateFallback() {
  return (
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
      <div>Loading...</div>
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
  return (
    <div className="container mx-auto mt-4">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
    </div>
  );
}
