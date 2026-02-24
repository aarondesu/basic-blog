import { useAppSelector } from "~/redux/hooks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

import defaultAvatar from "~/assets/user.png";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
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

export default function AuthHeader() {
  const { isAuthenticated, username } = useAppSelector((state) => state.auth);

  return (
    <div className="flex items-center">
      {isAuthenticated ? (
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
