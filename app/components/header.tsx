import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Link } from "react-router";
import Navigation from "./navigation";

export default function Header() {
  return (
    <div className="">
      <div className="container mx-auto py-4 flex place-items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          {/* Logo */}
          <div>Logo</div>
          {/* Search */}
          <div className="flex-1">
            <InputGroup className="">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <Navigation />
      </div>
    </div>
  );
}
