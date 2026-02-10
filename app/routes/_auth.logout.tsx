import { store } from "~/redux/store";
import type { Route } from "./+types/_auth.logout";
import { getSupabaseServerClient } from "~/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";
import { setAuthenticated } from "~/redux/reducers/auth";
import { redirect, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const { isAuthenticated } = store.getState().auth;

  if (isAuthenticated) {
    const client = getSupabaseServerClient(request);
    const result = await client.auth.signOut();

    return true;
  }

  return false;
}

export default function Logout({ loaderData }: Route.ComponentProps) {
  const success = loaderData;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      dispatch(setAuthenticated(false));
      toast.info("Successfully logged out!");
    } else {
      toast.warning("You are not logged in!");
    }

    navigate("/");
  }, [success]);

  return <div>Logging out...</div>;
}
