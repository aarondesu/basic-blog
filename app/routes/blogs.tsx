import type { Route } from "./+types/blogs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Blog | Blogs" },
    {
      name: "description",
      content: "Welcome to my blog!",
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
