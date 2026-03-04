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
import { useAppSelector } from "~/redux/hooks";
import { useState } from "react";
import { VisuallyHidden } from "radix-ui";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

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
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const isAuthenticated = false;

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon-lg" className="mx-2">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>Navigation</DrawerTitle>
            <VisuallyHidden.Root>
              <DrawerDescription />
            </VisuallyHidden.Root>
            <div className="flex flex-col gap-2 mt-4">
              <ul className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <li key={index} className="flex">
                    <Link
                      to={link.url}
                      className="py-2 px-4 flex-1"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </DrawerHeader>
        </DrawerContent>
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
      </div>
    );
  }
}
