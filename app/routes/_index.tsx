import { data, Link } from "react-router";
import type { Route } from "./+types/_index";
import Hero from "~/components/hero";
import { getSupabaseServerClient } from "~/lib/supabase";
import dayjs from "dayjs";
import type { BlogData } from "~/types";
import BlogItem from "~/components/blog-item";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Home" },
    {
      name: "description",
      content: "Welcome to myBlog!",
    },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);

  const result = await client
    .from("blogs_view")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(3);

  return data({
    blogs: result.data,
  });
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { blogs } = loaderData;

  return (
    <div className="">
      <Hero
        title="Welcome to myBlog"
        description="What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      />
      <div className="container mx-auto my-10 px-4 md:px-0">
        <div className="">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Latest Blogs</h2>
            <Link to="/blogs" className="underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {blogs &&
              blogs.map((blog) => <BlogItem blog={blog} key={blog.id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
