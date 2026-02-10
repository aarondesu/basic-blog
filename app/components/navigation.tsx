import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useIsMobile } from "~/hooks/use-mobile";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { useAppSelector } from "~/redux/hooks";
import { useEffect, useState } from "react";

interface MenuLink {
  label: string;
  url: string;
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
  {
    label: "About",
    url: "/about",
  },
];

export default async function Navigation() {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {}, [isAuthenticated]);

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
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link to={link.url}>{link.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              {isAuthenticated === true ? (
                <Link to="/logout">Logout</Link>
              ) : (
                <Link to="/login">Sign In</Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
}
