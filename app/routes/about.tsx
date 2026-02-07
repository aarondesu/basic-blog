import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Blog | About" },
    {
      name: "description",
      content: "Welcome to my blog!",
    },
  ];
}

export default function About() {
  return (
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold">About</h2>
    </div>
  );
}
