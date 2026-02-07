import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieMethodsServer,
} from "@supabase/ssr";

export function getSupabaseServerClient(request: Request) {
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

  const client = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: cookies,
  });

  return client;
}
