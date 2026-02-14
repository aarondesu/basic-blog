import { data, type MiddlewareFunction } from "react-router";
import { getSupabaseServerClient } from "./lib/supabase";
import { getSession } from "./server.session";
import type { QueryResult, QueryData, QueryError } from "@supabase/supabase-js";

/**
 * Auth middleware, to be used in server side middlewares
 * @param param0
 */
export const authMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const client = getSupabaseServerClient(request);
  const user = (await client.auth.getUser()).data.user;

  if (!user) {
    throw data(null, { status: 401, statusText: "Unauthorized" });
  }

  return await next();
};
