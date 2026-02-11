import {
  createServerClient,
  createBrowserClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieMethodsServer,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

let client: SupabaseClient<Database> | null = null;
let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseServerClient(request: Request) {
  if (!client) {
    const headers = new Headers(request.headers);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const cookies: CookieMethodsServer = {
      getAll: () => {
        const cookieHeader = request.headers.get("Cookie");
        if (!cookieHeader) {
          return null;
        }

        return parseCookieHeader(cookieHeader).map((cookie) => ({
          name: cookie.name,
          value: cookie.value ?? "",
        }));
      },
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    };

    client = createServerClient<Database>(supabaseUrl!, supabaseKey!, {
      cookies: cookies,
    });
  }

  return client;
}

export function getSupabaseBrowserClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  }

  return browserClient;
}
