// import SearchButton from './SearchButton';
import { useKBar } from "kbar";
import { Search } from "lucide-react";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { applicationNavigationMenus } from "./Shell";
import { Button } from "./button";
import { cn } from "./cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

// const navigationLinks = [
//   {
//     href: '/blog',
//     label: 'Blog',
//   },

// ];

export type DesktopNavProps = HTMLAttributes<HTMLDivElement> & {
  setIsCommandMenuOpen: (value: boolean) => void;
};

export const DesktopNav = ({ className, setIsCommandMenuOpen, ...props }: DesktopNavProps) => {
  const pathname = usePathname();
  const params = useParams();
  const { t } = useLocale();

  const [modifierKey, setModifierKey] = useState(() => "Ctrl");

  const rootHref = "";

  useEffect(() => {
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
    const isMacOS = /Macintosh|Mac\s+OS\s+X/i.test(userAgent);

    setModifierKey(isMacOS ? "⌘" : "Ctrl");
  }, []);
  const maxVisibleLinks = 4;
  const visibleLinks = applicationNavigationMenus.slice(0, maxVisibleLinks);
  const dropdownLinks = applicationNavigationMenus.slice(maxVisibleLinks);
  const { query } = useKBar();
  return (
    <div
      className={cn("ml-2 hidden flex-1 items-center gap-x-12 md:flex md:justify-between", className)}
      {...props}>
      <div className="flex items-center gap-x-6">
        {visibleLinks.map(({ href, name }) => (
          <Link
            key={href}
            href={`${rootHref}${href}`}
            className={cn(
              "text-muted-foreground dark:text-muted-foreground/60 focus-visible:ring-ring ring-offset-background rounded-md font-medium leading-5 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2",
              {
                "text-foreground dark:text-muted-foreground": pathname?.startsWith(`${rootHref}${href}`),
              }
            )}>
            {t(name)}
          </Link>
        ))}
        {dropdownLinks.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <Ellipsis className="text-muted-foreground h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={5}>
              {dropdownLinks.map(({ href, name }) => (
                <DropdownMenuItem key={href}>
                  <Link href={`${rootHref}${href}`}>{t(name)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Button
        variant="outline"
        className="text-muted-foreground flex w-96 items-center justify-between rounded-lg"
        onClick={query.toggle}>
        <div className="flex items-center">
          <Search className="mr-2 h-5 w-5 " />
          {t("Search")}
        </div>

        <div>
          <div className="text-muted-foreground bg-muted flex items-center rounded-md px-1.5 py-0.5  text-xs tracking-wider">
            {modifierKey}+K
          </div>
        </div>
      </Button>
    </div>
  );
};
