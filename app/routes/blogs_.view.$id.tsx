import { getSupabaseServerClient } from "~/lib/supabase";
import type { Route } from "./+types/blogs_.view.$id";
import { data, Link } from "react-router";
import dayjs from "dayjs";
import { useAppSelector } from "~/redux/hooks";
import { ButtonGroup } from "~/components/ui/button-group";
import { Button } from "~/components/ui/button";
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  ConfirmDeleteBlogDialog,
  ConfirmDeleteBlogDialogTrigger,
} from "~/components/confirm-delete-blog-dialog";
import CommentInput from "~/components/comment-input";

import Comment from "~/components/comment";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { useIsMobile } from "~/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import MarkdownRenderer from "~/components/markdown-renderer";
import removeMarkdown from "remove-markdown";
import ContentRenderer from "~/components/content-renderer";

export async function loader({ request, params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient(request);

  const blog = await client
    .from("view_blog_with_username")
    .select("*")
    .eq("id", Number(params.id))
    .single();

  // Check if no blog is found
  if (!blog.data) {
    throw data(null, { status: 404 });
  }

  const suggested = await client.from("random_blogs").select("*");

  // Get comments
  const current_page = Number(
    new URL(request.url).searchParams.get("page") ?? 1,
  );
  const per_page = 10; // Temp, will change later
  const comments = await client
    .from("comments")
    .select("*, user:profiles!user_id(username)", { count: "exact" })
    .eq("blog_id", Number(blog.data.id))
    .range((current_page - 1) * per_page, current_page * per_page - 1)
    .order("created_at", { ascending: false });

  return data({
    blog: blog.data,
    suggested: suggested.data,
    comments: {
      data: comments.data,
      last_Page: Math.ceil((comments.count ?? 1) / per_page),
      current_page: current_page,
      count: comments.count,
    },
  });
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { blog } = loaderData;

  if (!blog || !blog.body || !blog.title) return null;

  return [
    { title: `myBlog | ${blog?.title ?? "Loading..."}` },
    {
      name: "description",
      content: removeMarkdown(blog.body.substring(0, 500)),
    },
  ];
}

export default function ViewBlog({ loaderData }: Route.ComponentProps) {
  const { blog, comments, suggested } = loaderData;
  const {
    roles,
    user_id: auth_user_id,
    isAuthenticated,
  } = useAppSelector((state) => state.auth);
  const isMobile = useIsMobile();

  return (
    <div>
      {blog?.image_url && (
        <img
          src={blog.image_url}
          className="w-full md:h-[calc(100vh-70px)] max-h-360 object-cover object-center"
        />
        // <div className="relative">
        //   <img
        //     src={blog.image_url}
        //     className="w-full h-[calc(100vh-70px)] max-h-360 object-cover object-center"
        //   />
        //   <div className="absolute top-[50%] left-[50%]">
        //     <h2 className="text-black text-5xl">{blog.title}</h2>
        //   </div>
        // </div>
      )}
      <div className="container mx-auto space-y-6 my-4 px-4 md:px-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-6 flex-1">
            <div className="">
              <div className="space-y-4 flex-1">
                <div className="grid gap-1.5">
                  <div className="flex flex-row items-center gap-4 md:gap-0 mb-2 md:mb-0 justify-between">
                    <h1 className="text-3xl font-black">{blog?.title}</h1>
                    {isAuthenticated && blog?.user_id === auth_user_id && (
                      <ConfirmDeleteBlogDialog
                        id={Number(blog?.id)}
                        title={blog?.title ?? ""}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon">
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={`/blogs/edit/${blog?.id}`}>
                                  <PencilIcon />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <ConfirmDeleteBlogDialogTrigger>
                                <DropdownMenuItem>
                                  <TrashIcon />
                                  Delete
                                </DropdownMenuItem>
                              </ConfirmDeleteBlogDialogTrigger>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </ConfirmDeleteBlogDialog>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <p className="font-medium text-muted-foreground text-sm">
                      {isMobile ? (
                        <Tooltip>
                          <TooltipTrigger className="underline">
                            {dayjs(blog?.created_at).format("MMM DD, YYYY")}
                          </TooltipTrigger>
                          <TooltipContent>
                            {dayjs(blog?.created_at).format(
                              "MMM DD, YYYY HH:mm:ss",
                            )}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        dayjs(blog?.created_at).format("MMM DD, YYYY HH:mm:ss")
                      )}
                    </p>
                    <span className="flex gap-4">
                      <p className="text-sm text-muted-foreground font-bold">
                        by {blog?.author}
                      </p>
                      {blog.updated_at &&
                        dayjs(blog.created_at).diff(dayjs(blog.updated_at)) !==
                          0 && (
                          <p className="font-medium text-muted-foreground text-sm">
                            edited on{" "}
                            {dayjs(blog.updated_at).format(
                              "MMM DD, YYYY HH:mm:ss",
                            )}
                          </p>
                        )}
                    </span>
                  </div>
                </div>
                <div className="">
                  {/* <MarkdownRenderer content={blog.body ?? ""} /> */}
                  <ContentRenderer content={blog.body ?? ""} />
                </div>
              </div>
            </div>
            <div className="border-t pt-3 space-y-4">
              <h4 className="font-bold text-xl">Comments ({comments.count})</h4>
              {isAuthenticated ? (
                <CommentInput blog_id={blog?.id ?? 0} />
              ) : (
                <div className="border bg-muted rounded-md px-4 py-6">
                  <Link to="/login" className="underline">
                    Login
                  </Link>{" "}
                  to comment
                </div>
              )}
              <div className="flex flex-col">
                {comments.data &&
                  comments.data.map((comment, index) => (
                    <Comment key={comment.id} {...comment} />
                  ))}
              </div>
              <Pagination>
                <PaginationContent>
                  {[...new Array(comments.last_Page)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href={`?page=${index + 1}`}
                        isActive={comments.current_page - 1 === index}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
            </div>
          </div>
          {/* <div className="space-y-4 border-t md:border-none pt-6 md:pt-0">
            <h4 className="font-bold text-lg">Other Blogs</h4>
            <div className="flex flex-col gap-4">
              {suggested?.map((blog) => (
                <Link to={`/blogs/view/${blog.id}`} key={blog.id}>
                  <div
                    key={blog.id}
                    className="flex flex-col gap-2 border p-4 hover:bg-accent min-w-60 w-full md:max-w-60"
                  >
                    {blog.image_url && (
                      <img
                        src={blog.image_url}
                        className="w-full md:max-w-60"
                      />
                    )}
                    <div className="">
                      <h4 className="font-bold max-w-60 line-clamp-1">
                        {blog.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {blog.body}
                      {blog.body && blog.body?.length >= 100 && "..."}
                    </p>
                    <p className="underline mt-3 text-sm">Read More</p>
                  </div>
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
