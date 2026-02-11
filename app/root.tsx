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
import { setAuthenticated } from "./redux/reducers/auth";
import { commitSession, getSession } from "./server.session";
import { useEffect } from "react";

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

  return data(
    {
      isAuthenticated: user !== null,
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

export default function App({ loaderData }: Route.ComponentProps) {
  // Set authenticated
  store.dispatch(setAuthenticated(loaderData.isAuthenticated));

  // Handle flash messages
  const { error, message } = loaderData.flash;
  useEffect(() => {
    if (error) {
      // Display error message, display error code if supplied
      toast.error([error.code && `${error.code}: `, error.message]);
    }

    if (message) {
      toast.info(message);
    }
  }, [error, message]);

  return (
    <Provider store={store}>
      <Toaster />
      <div className="min-h-svh flex flex-col">
        <Header />
        <main className="flex-1 grid">
          <Outlet />
        </main>
        <Footer />
      </div>
    </Provider>
  );
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
