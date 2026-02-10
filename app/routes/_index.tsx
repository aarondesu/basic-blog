import { useCallback } from "react";
import type { Route } from "./+types/_index";
import Hero from "~/components/hero";
import {
  getSupabaseBrowserClient,
  getSupabaseServerClient,
} from "~/lib/supabase";
import { Button } from "~/components/ui/button";

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
  const client = getSupabaseBrowserClient();

  const onClick = useCallback(async () => {
    const test = await client.auth.getUser();

    console.log(test);
  }, [client]);

  return (
    <div className="">
      <Hero title="Welcome to my Blog" description="Lorem Ipsum" />
      <Button onClick={onClick}>test</Button>
    </div>
  );
}
