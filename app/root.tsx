import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { toast, Toaster } from "sonner";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import { getSupabaseServerClient } from "./lib/supabase";
import { setAuthenticated, setUserInfo } from "./redux/reducers/auth";
import { commitSession, getSession } from "./server.session";
import React, { useEffect } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  // Handle flash message
  const session = await getSession(request.headers.get("Cookie"));

  // Handle user authentication
  const client = getSupabaseServerClient(request);
  const user = (await client.auth.getUser()).data.user;
  const profile = user
    ? (
        await client
          .from("profiles")
          .select("*")
          .eq("user_id", user?.id ?? "")
      ).data?.at(0)
    : undefined;
  const roles = user
    ? (
        await client
          .from("user_roles")
          .select("roles(role_name)")
          .eq("user_id", String(user?.id))
      ).data
    : undefined;

  return data(
    {
      user: user,
      isAuthenticated: user !== null,
      profile: profile,
      roles: roles,
      user_id: user?.id,
      flash: {
        error: session.get("error"),
        message: session.get("message"),
      },
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export default function App({ ...props }: Route.ComponentProps) {
  return (
    <Provider store={store}>
      <AuthenticationHandler {...props} />
      <Toaster />
      <div className="min-h-svh flex flex-col">
        <Header />
        <main className="flex-1 grid mb-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

/**
 * Temporary workaround for hydration errors
 * @param param0
 * @returns
 */
function AuthenticationHandler({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated, roles, flash, profile, user_id, user } = loaderData;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthenticated(isAuthenticated));
    dispatch(
      setUserInfo({
        username: profile?.username,
        roles: roles?.map((role) => role.roles.role_name) ?? [],
        user_id: user_id,
        email: user?.email,
      }),
    );
  }, [isAuthenticated, roles, profile, user_id, user]);

  // Handle flash messages
  const { error, message } = flash;
  useEffect(() => {
    if (error) {
      // Display error message, display error code if supplied
      toast.error([error.code && `${error.code}: `, error.message]);
    }

    if (message) {
      toast.info(message);
    }
  }, [error, message]);

  return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
