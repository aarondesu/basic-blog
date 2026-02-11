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
import { ChevronDown, MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { useAppSelector } from "~/redux/hooks";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    prefetch: true,
  },
];

export default function Navigation() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="mx-2">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>Test</DrawerContent>
      </Drawer>
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
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar size="sm">
                  <AvatarImage src="./user.png" alt="user" />
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
