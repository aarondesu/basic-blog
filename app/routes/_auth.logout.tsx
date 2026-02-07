import { store } from "~/redux/store";
import type { Route } from "./+types/_auth.logout";
import { getSupabaseServerClient } from "~/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";
import { setAuthenticated } from "~/redux/reducers/auth";
import { redirect, useNavigate } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = store.getState().auth;

  if (isAuthenticated) {
    const client = getSupabaseServerClient(request);
    await client.auth.signOut();

    store.dispatch(setAuthenticated(false));
    redirect("/");

    return true;
  }

  return false;
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  const success = loaderData;
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      toast.info("Successfully logged out!");
    } else {
      toast.warning("You are not logged in!");
    }

    navigate("/");
  }, [success]);

  return <></>;
}
