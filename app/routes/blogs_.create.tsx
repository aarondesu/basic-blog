import type { Route } from "./+types/blogs_.create";

import { data, redirect } from "react-router";

import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";
import { store } from "~/redux/store";
import BlogForm from "~/components/forms/blog.form";

// Temp

export async function action({ request }: Route.ActionArgs) {
  // Get needed variables
  const session = await getSession(request.headers.get("Cookie"));
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();

  // Attempt to insert into database
  const { error } = await client.from("blogs").insert({
    user_id: formData.get("user_id") as string,
    title: formData.get("title") as string,
    image_url: (formData.get("image_url") as string) ?? undefined,
    body: formData.get("body") as string,
  });

  // Check if error
  if (error) {
    return data(
      { error: error },
      { headers: { "Set-Cookie": await commitSession(session) } },
    );
  } else {
    session.flash("message", "Successfully created blog!");

    return redirect("/blogs", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const client = getSupabaseServerClient(request);

  const { isAuthenticated, user_id } = store.getState().auth;
  const { roles } = store.getState().auth;

  // Authenticate route, must be logged in to create a blog
  if (!isAuthenticated || !roles.includes("Admin")) {
    // Display unauthorized error
    throw data(null, { status: 401, statusText: "Unauthorized" });
  }

  return data(
    {
      user_id: user_id,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Create Blog" },
    {
      name: "description",
      content: "Welcome to my blog!",
    },
  ];
}

export default function CreateBlog({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="container mx-auto px-4 md:px-0">
      <div>
        <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      </div>
      {actionData?.error && (
        <div className="border border-destructive bg-destructive/8 px-2 py-2 text-destructive text-sm mb-4">
          {actionData.error.message}
        </div>
      )}

      <BlogForm mode="create" error={actionData?.error} />
    </div>
  );
}
