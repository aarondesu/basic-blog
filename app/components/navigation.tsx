"user client";

import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import { Button } from "./ui/button";
import { ChevronDown, MenuIcon, PlusIcon } from "lucide-react";
import { useAppSelector } from "~/redux/hooks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import defaultAvatar from "~/assets/user.png";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "./ui/sidebar";
import MobileNavUser from "./mobile-nav-user";
import { VisuallyHidden } from "radix-ui";

interface MenuLink {
  label: string;
  url: string;
  prefetch?: boolean;
}

const links: MenuLink[] = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "Blogs",
    url: "/blogs",
  },
];

/**
 * Navigation Menu
 * TODO: improve mobile version
 * @returns
 */
export default function Navigation() {
  const [open, setOpen] = useState<boolean>(false);
  const { roles } = useAppSelector((state) => state.auth);

  const isMobile = useIsMobile();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mx-2">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          showCloseButton={false}
          aria-describedby="mobile-navigation"
          className="w-fit"
        >
          <VisuallyHidden.Root>
            <SheetHeader>
              <SheetTitle>myBlog</SheetTitle>
            </SheetHeader>
          </VisuallyHidden.Root>
          <SidebarProvider>
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarHeader>
                <MobileNavUser />
              </SidebarHeader>
              <SidebarSeparator />
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    {links.map((link, index) => (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                          <Link to={link.url} reloadDocument>
                            {link.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
                {isAuthenticated && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Blogs</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/blogs/create" reloadDocument>
                            Create New Blog
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <div className="flex gap-2 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.url}
                    prefetch={link.prefetch ? "intent" : "none"}
                    reloadDocument
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {roles.includes("Admin") && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/blogs/create" reloadDocument>
                    <PlusIcon />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar size="sm" className="bg-muted-foreground">
                  <AvatarImage src={defaultAvatar} alt="user" />
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarBadge>
                    <ChevronDown />
                  </AvatarBadge>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                {isAuthenticated === true ? (
                  <Link to="/logout">Logout</Link>
                ) : (
                  <Link to="/login">Sign In</Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login" className="text-sm">
            Login
          </Link>
        )}
      </div>
    );
  }
}
