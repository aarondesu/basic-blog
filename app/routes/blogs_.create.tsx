import type { Route } from "./+types/blogs_.create";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSubmit } from "react-router";
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

// Temp
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image_url: z.url().optional(),
  body: z.string().min(1, "Body is required"),
});

export async function action({ request }: Route.ActionArgs) {}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "myBlog | Create Blog" },
    {
      name: "description",
      content: "Welcome to my blog!",
    },
  ];
}

export default function CreateBlog({}: Route.ComponentProps) {
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
                <Textarea {...field} className="h-87.5" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex">
            <Button type="submit">Create</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
