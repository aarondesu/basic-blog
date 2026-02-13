import {
  getSupabaseBrowserClient,
  getSupabaseServerClient,
} from "~/lib/supabase";
import type { Route } from "./+types/blogs_.view.$id";
import { data, Link } from "react-router";
import dayjs from "dayjs";
import { useAppSelector } from "~/redux/hooks";
import { ButtonGroup } from "~/components/ui/button-group";
import { Button } from "~/components/ui/button";
import { DeleteIcon, PencilIcon, TrashIcon } from "lucide-react";
import ConfirmDeleteBlogDialog from "~/components/confirm-delete-blog-dialog";
import CommentInput from "~/components/comment-input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import defaultAvatar from "~/assets/user.png";
import Comment from "~/components/comment";

export function HydrateFallback({}: Route.HydrateFallbackProps) {
  return <div className="container mx-auto">Test</div>;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);

  const result = await client
    .from("view_blog_with_username")
    .select(
      "*, comments!blog_id(id, user_id, body, image_url, created_at, user:profiles!user_id(username))",
    )
    .eq("id", Number(params.id))
    .limit(1);

  // Check if no blog is found
  if (result.data && result.data.length === 0) {
    throw data(null, { status: 404 });
  }

  return data({
    blog: result.data?.at(0),
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

export default function ViewBlog({ loaderData }: Route.ComponentProps) {
  const { blog } = loaderData;
  const { roles, user_id: auth_user_id } = useAppSelector(
    (state) => state.auth,
  );

  return (
    <div className="container mx-auto space-y-6 my-4 px-4 md:px-0">
      <div className="space-y-4">
        <div className="">
          <span className="flex items-end gap-4 mb-2 md:mb-0">
            <h1 className="text-3xl font-black">{blog?.title}</h1>
            {roles.includes("Admin") && blog?.user_id === auth_user_id && (
              <span className="flex-1">
                <ButtonGroup className="justify-self-end">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link to={`/blogs/edit/${blog?.id}`} reloadDocument>
                      <PencilIcon />
                      Edit
                    </Link>
                  </Button>
                  <ConfirmDeleteBlogDialog
                    id={Number(blog?.id)}
                    title={blog?.title ?? ""}
                  >
                    <Button type="button" variant="outline" size="sm">
                      {/* <Link to={`/blogs/delete/${blog?.id}`}>
                      <TrashIcon />
                      Delete
                    </Link> */}
                      <TrashIcon />
                      Delete
                    </Button>
                  </ConfirmDeleteBlogDialog>
                </ButtonGroup>
              </span>
            )}
          </span>
          <span className="flex gap-2">
            <p className="font-medium text-muted-foreground text-sm">
              {dayjs(blog?.created_at).format("MMM DD, YYYY HH:mm:ss")}
            </p>
            <p className="text-sm text-muted-foreground font-bold">
              by {blog?.author}
            </p>
          </span>
        </div>
        {blog?.image_url && blog.image_url !== "undefined" && (
          <img src={blog.image_url} />
        )}
        <div>
          <p className="whitespace-pre-wrap">{blog?.body}</p>
        </div>
      </div>
      <div className="border-t pt-3 space-y-4">
        <h4 className="font-bold text-xl">
          Comments ({blog?.comments.length})
        </h4>
        <CommentInput blog_id={blog?.id ?? 0} />
        <div className="flex flex-col">
          {blog?.comments &&
            blog.comments.map((comment, index) => (
              <Comment key={comment.id} {...comment} />
            ))}
        </div>
      </div>
    </div>
  );
}
