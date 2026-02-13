"use client";

import { Link } from "react-router";
import Navigation from "./navigation";
import SearchBar from "./search-bar";
import {} from "~/database.types";

export default function Header() {
  return (
    <div className="">
      <div className="container mx-auto py-4 flex place-items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          {/* Logo */}
          <span className="px-4 py-2">
            <Link to="/">
              <p className="font-black select-none">myBlog</p>
            </Link>
          </span>
          {/* Search */}
          {/* <SearchBar /> */}
        </div>
        <Navigation />
      </div>
    </div>
  );
}
