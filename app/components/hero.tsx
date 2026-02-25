import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Link } from "react-router";

type Args = {
  title: string;
  description: string;
};

export default function Hero({ title, description }: Args) {
  return (
    <div
      className={cn(
        `bg-[url('/assets/images/pexels-andreea-ch-371539-1166644.jpg')]`,
        "bg-cover bg-no-repeat bg-bottom-left md:bg-bottom",
        "flex min-h-svh md:min-h-[calc(100vh-70px)] ",
      )}
    >
      <div className="space-y-6 w-100 m-auto items-center text-center">
        <div className="space-y-2">
          <p className="text-center text-4xl font-extrabold">{title}</p>
          <p className="text-center">{description}</p>
        </div>
        <Button variant="secondary" className="p-7" asChild>
          <Link to="/blogs" reloadDocument>
            View Blogs
          </Link>
        </Button>
      </div>
    </div>
  );
}
