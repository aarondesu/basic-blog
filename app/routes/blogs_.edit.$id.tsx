import { getSupabaseServerClient } from "~/lib/supabase";
import type { Route } from "./+types/blogs_.edit.$id";
import { data, redirect, type MiddlewareFunction } from "react-router";
import BlogForm from "~/components/forms/blog.form";
import { commitSession, getSession } from "~/server.session";
export async function action({ request }: Route.ActionArgs) {
  // Get needed variables
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const client = getSupabaseServerClient(request);

  //  Attempt to update blog in database
  const { error } = await client
    .from("blogs")
    .update({
      title: formData.get("title") as string,
      image_url: formData.get("image_url") as string,
      body: formData.get("body") as string,
    })
    .eq("id", Number(formData.get("id")));

  // Check if error, if error display error in form
  if (error) {
    return data(
      { error: error },
      { headers: { "Set-Cookie": await commitSession(session) } },
    );
  }

  session.flash("message", "Successfully updated blog!");

  return redirect("/blogs", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { id } = params;

  const client = getSupabaseServerClient(request);
  const user = (await client.auth.getUser()).data.user;

  if (!user) {
    throw data(null, { status: 401, statusText: "Unauthorized" });
  }

  const result = await client
    .from("blogs")
    .select("*")
    .eq("id", Number(id))
    .single();

  // Check if blog exists
  if (!result.data) {
    throw data(null, { status: 404 });
  }

  // Check if logged in user is owner of blog
  if (user?.id !== result.data.user_id) {
    throw data(null, { status: 401, statusText: "Unauthorized" });
  }

  return data({
    blog: result.data,
  });
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { blog } = loaderData;

  return [
    { title: `myBlog | ${blog?.title ?? "Loading..."}` },
    {
      name: "description",
      content: blog?.body?.substring(0, 500),
    },
  ];
}

export default function EditBlog({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { blog } = loaderData;

  return (
    <div className="container mx-auto px-4 md:px-0">
      <div>
        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      </div>
      {actionData?.error && <div>{actionData.error.message}</div>}

      <BlogForm mode="edit" data={blog} error={actionData?.error} />
    </div>
  );
}
