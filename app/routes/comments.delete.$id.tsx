import { data } from "react-router";
import type { Route } from "./+types/comments.delete.$id";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

export async function action({ request, params }: Route.ActionArgs) {
  // Get needed variables
  const formData = await request.formData();
  const client = getSupabaseServerClient(request);
  const session = await getSession(request.headers.get("Cookie"));

  if (!params.id) {
    return data(null, { status: 404, statusText: "Unauthorized" });
  }

  // Attempt to delete comment
  const result = await client
    .from("comments")
    .delete()
    .eq("id", Number(params.id));

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
