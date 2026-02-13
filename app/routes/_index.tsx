import type { Route } from "./+types/_index";
import Hero from "~/components/hero";
import { getSupabaseServerClient } from "~/lib/supabase";

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Home" },
    {
      name: "description",
      content: "Welcome to myBlog!",
    },
  ];
}

export default function Index() {
  return (
    <div className="">
      <Hero title="Welcome to myBlog" description="Lorem Ipsum" />
    </div>
  );
}
