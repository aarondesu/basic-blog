import { data } from "react-router";
import type { Route } from "./+types/comments.create";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

export async function action({ request, params }: Route.ActionArgs) {
  // Get needed variables
  const formData = await request.formData();
  const client = getSupabaseServerClient(request);
  const session = await getSession(request.headers.get("Cookie"));

  // Attempt to create comment
  const result = await client.from("comments").insert({
    user_id: formData.get("user_id") as string,
    blog_id: Number(formData.get("blog_id")),
    body: formData.get("body") as string,
    image_url: (formData.get("image_url") as string) ?? undefined,
  });

  if (result.error) {
    session.flash("error", {
      code: result.error.code,
      message: result.error.message,
    });
  }

  return data(result.data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
