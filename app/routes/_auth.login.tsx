import type { Route } from "./+types/_auth.login";

import { useSubmit } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { commitSession, getSession } from "~/lib/session";

export async function clientAction({ request }: Route.ClientActionArgs) {
  // Get needed variables
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));

  // Attempt to login user with Supabase
  const { data, error } = await client.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  // Display toast message if error occured
  if (error) {
    toast.error(error.message);
    return;
  }

  // Display success message if login was successful
  toast.success("Logged in successfully!");

  // TODO: set session cookie with access token and redirect to home page
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Blog | Lgin" },
    {
      name: "description",
      content: "Login to your account.",
    },
  ];
}

export default function Login() {
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
    <Card className="space-y-4 w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login To Your Account</CardTitle>
        <CardDescription>Fill in the following details</CardDescription>
      </CardHeader>
      <CardContent>
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
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" form="login-form">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
