import { Loader2Icon } from "lucide-react";
import type { Route } from "./+types/blogs_.create";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { data, redirect, useNavigation, useSubmit } from "react-router";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

// Temp
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image_url: z.url().optional(),
  body: z.string().min(1, "Body is required"),
});

export async function action({ request }: Route.ActionArgs) {
  // Get needed variables
  const session = await getSession(request.headers.get("Cookie"));
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();

  // Attempt to insert into database
  const { error } = await client.from("blogs").insert({
    user_id: formData.get("user_id") as string,
    title: formData.get("title") as string,
    image_url: formData.get("image_url") as string,
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
  const user = (await client.auth.getUser()).data.user;

  // Authenticate route, must be logged in to create a blog
  if (!user) {
    session.flash("error", {
      code: "401",
      message: "You must be logged in to continue",
    });

    throw redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return data(
    {
      user: user,
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

export default function CreateBlog({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();

  const { user } = loaderData;

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const submit = useSubmit();
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("user_id", user.id); // Append the user id into the form data

    submit(formData, { action: "/blogs/create", method: "POST" });
  });

  return (
    <div className="container mx-auto px-4 md:px-0">
      <div>
        <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      </div>
      <form onSubmit={onSubmit}>
        <FieldGroup className="">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Title..."
                  className="max-w-93.75"
                  disabled={navigation.state === "loading"}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="image_url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Image</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Title..."
                  className="max-w-93.75"
                  disabled={navigation.state === "loading"}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-2">
                <FieldLabel>Body</FieldLabel>
                <Textarea
                  {...field}
                  className="h-87.5"
                  disabled={navigation.state === "loading"}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="reset"
              variant="outline"
              disabled={navigation.state === "loading"}
            >
              Reset
            </Button>
            <Button type="submit" disabled={navigation.state === "loading"}>
              {navigation.state === "loading" && (
                <Loader2Icon className="animate-spin" />
              )}
              Create
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
