import { store } from "~/redux/store";
import type { Route } from "./+types/_auth.logout";
import { getSupabaseServerClient } from "~/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";
import { setAuthenticated } from "~/redux/reducers/auth";
import { redirect, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

export async function loader({ request }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);
  const session = await client.auth.getSession();
  const result = await client.auth.signOut();

  return result.error !== null;
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
