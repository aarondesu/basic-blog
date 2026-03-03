import { Link } from "react-router";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="bg-gray-800">
      <div className="flex container mx-auto py-4 px-4 md:px-0 text-white items-center">
        <span className="flex-1 select-none">
          <p className="text-xs">myBlog @ 2026</p>
        </span>
        <span>
          <Link
            to="https://github.com/aarondesu/basic-blog"
            target="_blank"
            className="size"
          >
            <FaGithub className="size-5" />
          </Link>
        </span>
      </div>
    </div>
  );
}
