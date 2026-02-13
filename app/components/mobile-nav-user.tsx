import { useAppSelector } from "~/redux/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

import defaultAvatar from "~/assets/user.png";
import { Link } from "react-router";
import { ChevronDown, LogInIcon, LogOutIcon } from "lucide-react";

export default function MobileNavUser() {
  const { username, isAuthenticated, email } = useAppSelector(
    (state) => state.auth,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar size="sm">
                <AvatarImage src={defaultAvatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {isAuthenticated ? (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-sm font-medium">{username}</span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </div>
              ) : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-sm font-medium">Not Logged In</span>
                </div>
              )}
              <ChevronDown className="size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-popper-anchor-width)"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                {isAuthenticated ? (
                  <Link to="/logout" className="text-sm">
                    <LogOutIcon />
                    Logout
                  </Link>
                ) : (
                  <Link to="/login" className="text-sm">
                    <LogInIcon />
                    Login
                  </Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
