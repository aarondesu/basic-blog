import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import type { Route } from "./+types/blogs_.create";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { data, redirect, useNavigation, useSubmit } from "react-router";
import z, { file } from "zod";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  getSupabaseBrowserClient,
  getSupabaseServerClient,
} from "~/lib/supabase";
import { commitSession, getSession } from "~/server.session";
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  type FileUploadProps,
} from "~/components/ui/file-upload";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { randString } from "~/lib/utils";
import { store } from "~/redux/store";

// Temp
const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image_url: z.string().optional(),
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
  const { roles } = store.getState().auth;

  // Authenticate route, must be logged in to create a blog
  if (!user || roles.includes("Admin") === false) {
    // Display unauthorized error
    throw data(null, { status: 401, statusText: "Unauthorized" });
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

export default function CreateBlog({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { user } = loaderData;

  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Form
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

  // Handle file reject
  const client = getSupabaseBrowserClient();
  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // Handle image upload
  // TODO: improve system so only authorized users can upload
  const onUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (files, { onError, onProgress, onSuccess }) => {
      try {
        setIsUploading(true);

        const uploadPromises = files.map(async (file) => {
          if (!client) return;

          const bucketResult = await client.storage
            .from("images")
            .upload(`${randString()}-${randString()}`, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (bucketResult.error) {
            onError(file, {
              name: bucketResult.error.name,
              message: bucketResult.error.message,
            });
          }

          const { data } = await client.storage
            .from("images")
            .getPublicUrl(bucketResult.data?.path ?? "");

          // Set image_url
          form.setValue("image_url", data.publicUrl);

          onSuccess(file);
        });

        await Promise.all(uploadPromises);
        setIsUploading((state) => (state = false));
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [],
  );

  return (
    <div className="container mx-auto px-4 md:px-0">
      <div>
        <h1 className="text-3xl font-bold mb-6">Create a Blog</h1>
      </div>
      {actionData?.error && <div>{actionData.error.message}</div>}

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
                  disabled={navigation.state === "loading" || isUploading}
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
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  maxSize={5 * 2048 * 2048}
                  onFileReject={onFileReject}
                  value={files}
                  onValueChange={setFiles}
                  onUpload={onUpload}
                  className=""
                  disabled={isLoading || isUploading}
                >
                  {files.length === 0 && (
                    <FileUploadDropzone>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                          <UploadIcon className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">
                          Drag & drop file here
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Or click to browse (max 1 file)
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-fit"
                        >
                          Browse files
                        </Button>
                      </FileUploadTrigger>
                    </FileUploadDropzone>
                  )}
                  <FileUploadList>
                    {files.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemProgress />
                        <FileUploadItemDelete asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                          >
                            <XIcon />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
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
                  disabled={isLoading || isUploading}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex flex-col md:flex-row justify-end gap-2">
            <Button
              type="reset"
              variant="outline"
              className="w-full md:w-fit"
              disabled={isLoading || isUploading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full md:w-fit"
            >
              {isLoading && <Loader2Icon className="animate-spin" />}
              Create
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
