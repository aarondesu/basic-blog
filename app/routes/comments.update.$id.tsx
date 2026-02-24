import { data } from "react-router";
import type { Route } from "./+types/comments.update.$id";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

export async function action({ request, params }: Route.ActionArgs) {
  // Get needed variables
  const formData = await request.formData();
  const client = getSupabaseServerClient(request);
  const session = await getSession(request.headers.get("Cookie"));

  // Check if id exists
  if (!params.id) {
    return data(null, { status: 404, statusText: "Unauthorized" });
  }

  console.log(formData);

  // Attempt to create comment
  const result = await client
    .from("comments")
    .update({
      body: formData.get("body") as string,
      image_url: (formData.get("image_url") as string) ?? null,
    })
    .eq("id", Number(params.id));

  console.log(result);

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
