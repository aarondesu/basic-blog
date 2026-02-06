import { Button } from "~/components/ui/button";
import Header from "~/components/header";

import type { Route } from "./+types/_index";
import Hero from "~/components/hero";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Blog | Home" },
    {
      name: "description",
      content: "Welcome to my blog!",
    },
  ];
}

export default function Index() {
  return (
    <div className="">
      <Hero title="Welcome to my Blog" description="Lorem Ipsum" />
    </div>
  );
}
