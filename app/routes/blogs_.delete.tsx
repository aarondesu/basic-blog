import { redirect } from "react-router";
import type { Route } from "./+types/blogs_.delete";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

/**
 * Resource route, deletes the selected blog
 * @param param0
 * @returns
 */
export async function action({ request }: Route.ActionArgs) {
  // Get needed variables
  const formData = await request.formData();
  const client = getSupabaseServerClient(request);
  const session = await getSession(request.headers.get("Cookie"));

  const result = await client
    .from("blogs")
    .delete()
    .eq("id", Number(formData.get("id")));

  if (result.error) {
    session.flash("error", {
      code: result.error.code,
      message: result.error.message,
    });

    throw redirect(`/blogs/view/${formData.get("id")}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.flash("message", "Successfully delete blog!");
  return redirect("/blogs", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
