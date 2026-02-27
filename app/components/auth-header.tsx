import { useAppSelector } from "~/redux/hooks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { ChevronDownIcon, LogOutIcon, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AuthHeader() {
  const { isAuthenticated, username } = useAppSelector((state) => state.auth);

  return (
    <div className="flex gap-2 items-center">
      {isAuthenticated ? (
        <>
          <Tooltip defaultOpen>
            <TooltipTrigger>
              <Link to="/blogs/create" reloadDocument>
                <PlusIcon size="20" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a blog</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className=" rounded-full"
              >
                <Avatar size="sm" className="bg-muted-foreground">
                  <AvatarImage src={defaultAvatar} />
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarBadge className="z-10-">
                    <ChevronDownIcon />
                  </AvatarBadge>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/logout" reloadDocument>
                  <LogOutIcon />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button type="button" variant="secondary" asChild>
          <Link to="/login" reloadDocument className="text-sm">
            Login
          </Link>
        </Button>
      )}
    </div>
  );
}
