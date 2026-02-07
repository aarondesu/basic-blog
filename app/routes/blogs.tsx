import type { Route } from "./+types/blogs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Blogs" },
    {
      name: "description",
      content: "Welcome to myBlog!",
    },
  ];
}

export default function Blogs() {
  return (
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold">Blogs</h2>
    </div>
  );
}
