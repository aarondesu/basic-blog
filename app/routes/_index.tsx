import type { Route } from "./+types/_index";
import Hero from "~/components/hero";
import { getSupabaseServerClient } from "~/lib/supabase";
import { getSession } from "~/lib/session";

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
}

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
