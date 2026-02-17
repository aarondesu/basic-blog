import { redirect, type MiddlewareFunction } from "react-router";
import type { Route } from "./+types/_auth.logout";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";
import { authMiddleware } from "~/middlewares";

export const middleware: MiddlewareFunction[] = [authMiddleware];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const client = getSupabaseServerClient(request);
  const { error } = await client.auth.signOut();

  // Check error if logging out
  if (error) {
    session.flash("error", {
      code: error.code,
      message: error.message,
    });
  } else {
    session.flash("message", "Successfully logged out!");
  }

  // Redirect to home
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
