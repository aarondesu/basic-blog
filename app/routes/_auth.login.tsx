import type { Route } from "./+types/_auth.login";

import { Loader2Icon } from "lucide-react";
import { Link, useNavigation, useSubmit, redirect, data } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { type LoginData } from "~/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { loginSchema } from "~/schemas";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { getSupabaseServerClient } from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";

export async function action({ request }: Route.ActionArgs) {
  // Get server session
  const session = await getSession(request.headers.get("Cookie"));

  // Get needed variables
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();

  // Attempt to login user with Supabase
  const result = await client.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  // Display error if error, redirect page to home if successfully logged in
  if (result.error) {
    return data(
      { error: result.error },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  } else {
    session.flash("message", "Successfully logged in!");

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  // Get server session
  const session = await getSession(request.headers.get("Cookie"));

  const client = getSupabaseServerClient(request);
  const user = (await client.auth.getUser()).data.user;

  if (user !== null) {
    session.flash("error", { message: "You are already logged in" });

    throw redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Login" },
    {
      name: "description",
      content: "Login to your account.",
    },
  ];
}

export default function Login({ actionData }: Route.ComponentProps) {
  // Get navigation
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  // Create RHF object with Zod validation
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle submit function, will use react router's action to submit form data
  const submit = useSubmit();
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    submit(formData, { action: "/login", method: "POST" });
  });

  return (
    <Card className="space-y-4 w-full max-w-sm max-h-fit m-auto">
      <CardHeader>
        <CardTitle>Login To Your Account</CardTitle>
        <CardDescription>Fill in the following details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionData?.error && actionData.error.message && (
          <div className="border border-destructive bg-destructive/8 px-2 py-2 text-destructive text-sm ">
            {actionData?.error?.message}
          </div>
        )}
        <form onSubmit={onSubmit} id="login-form">
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email Address"
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button
          type="submit"
          className="w-full"
          form="login-form"
          disabled={isLoading}
        >
          {navigation.state === "submitting" && (
            <Loader2Icon className="animate-spin" />
          )}
          Login
        </Button>
        <span className="text-center">
          <p className="text-sm">New account?</p>
          <Link
            to="/register"
            className="underline text-sm text-muted-foreground hover:text-accent-foreground"
          >
            Sign up
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
