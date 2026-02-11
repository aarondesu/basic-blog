import type { Route } from "./+types/_auth.register";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  data,
  Link,
  redirect,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { getSupabaseServerClient } from "~/lib/supabase";
import { setAuthenticated } from "~/redux/reducers/auth";
import { store } from "~/redux/store";
import { registerUserSchema } from "~/schemas";
import { commitSession, getSession } from "~/server.session";
import type { ReigsterData } from "~/types";

export async function action({ request }: Route.ActionArgs) {
  // Get server session
  const session = await getSession(request.headers.get("Cookie"));

  const client = getSupabaseServerClient(request);
  const formData = await request.formData();

  // Attempt to create a user
  const result = await client.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        display_name: formData.get("display_name") as string,
      },
    },
  });

  store.dispatch(setAuthenticated(true));

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
    session.flash("message", "Successfully registered!");

    // Redirect to home after registering
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
  return [{ title: "myBlog | Register" }];
}

export default function Register({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const form = useForm<ReigsterData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      display_name: "",
    },
  });

  // Handle register submit, same as login
  const submit = useSubmit();
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    submit(formData, { action: "/register", method: "POST" });
  });

  return (
    <Card className="space-y-4 w-full max-w-sm max-h-fit m-auto">
      <CardHeader>
        <CardTitle>Register an Account</CardTitle>
        <CardDescription>
          Fill in the following details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {actionData?.error && actionData.error.message && (
          <div className="border border-destructive bg-destructive/8 px-2 py-2 text-destructive text-sm ">
            {actionData?.error?.message}
          </div>
        )}
        <form onSubmit={onSubmit} id="register-form">
          <FieldGroup>
            <Controller
              name="display_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Username*</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email*</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    aria-invalid={fieldState.invalid}
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
                  <FieldLabel>Password*</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirm Password*</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
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
          form="register-form"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" && (
            <Loader2Icon className="animate-spin" />
          )}
          Register
        </Button>
        <span className="text-center">
          <p className="text-sm">Already have an account?</p>
          <Link
            to="/login"
            className="underline text-sm text-muted-foreground hover:text-accent-foreground"
          >
            Sign in
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
