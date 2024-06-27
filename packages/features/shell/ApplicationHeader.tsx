import { type ClassValue, clsx } from "clsx";
import { CheckCircle2, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import useLinks from "../../../apps/web/hooks/useLinks";
import { applicationNavigationMenus } from "./Shell";
import { AvatarWithText } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ApplicationHeader = () => {
  const { t } = useLocale();
  const { status, data } = useSession();
  const formatAvatarFallback = (teamName?: string) => {
    if (teamName !== undefined) {
      return teamName.slice(0, 1).toUpperCase();
    }
  };

  const { menuNavigationLinks } = useLinks();
  if (!data) return null;
  if (!data.user) return null;

  return (
    <header className="mx-auto  hidden w-full max-w-screen-xl items-center justify-between gap-x-4 border-b border-gray-200 px-4 py-3 md:flex md:justify-normal md:px-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <Image
            width={168}
            height={50}
            className="h-10 w-full object-contain "
            src="https://res.cloudinary.com/dizm8txou/image/upload/landing-page/assets/day/logo.webp"
            alt="Logo"
          />
        </div>
        <div>
          <ul className="flex space-x-6">
            {menuNavigationLinks.map(({ href, text }) => {
              return (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600  hover:text-gray-900">
                    {text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="menu-switcher"
                variant="ghost"
                className="relative flex h-12 flex-row items-center px-0 py-2 ring-0 focus:outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-transparent md:min-w-[200px] md:px-2">
                <AvatarWithText
                  avatarFallback={formatAvatarFallback(data.user.name as string) as string}
                  primaryText={data.user.name}
                  secondaryText={t("Personal")}
                  rightSideComponent={<ChevronsUpDown className="text-muted-foreground ml-auto h-4 w-4" />}
                  textSectionClassName="hidden lg:flex"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className={cn("z-[60] ml-6 w-full min-w-[320px] md:ml-0")}
              align="end"
              forceMount>
              <DropdownMenuLabel>{t("Personal")}</DropdownMenuLabel>

              <DropdownMenuItem asChild>
                <Link href={"/"}>
                  <AvatarWithText
                    avatarFallback={formatAvatarFallback(data.user.name as string) as string}
                    primaryText={data.user.name}
                    secondaryText={t("Personal")}
                    rightSideComponent={
                      <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
                    }
                  />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mt-2" />

              <DropdownMenuLabel>
                <div className="flex flex-row items-center justify-between">
                  <p>{t("Teams")}</p>

                  <div className="flex flex-row space-x-2">
                    <DropdownMenuItem asChild>
                      <Button
                        title="Manage teams"
                        variant="ghost"
                        className="text-muted-foreground flex h-5 w-5 items-center justify-center p-0"
                        asChild>
                        <Link href="/settings/teams">
                          <Settings2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Button
                        title="Create team"
                        variant="ghost"
                        className="text-muted-foreground flex h-5 w-5 items-center justify-center p-0"
                        asChild>
                        <Link href="/settings/teams?action=add-team">
                          <Plus className="h-4 w-4" />
                        </Link>
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuLabel>

              <div className="custom-scrollbar max-h-[40vh] overflow-auto">
                <DropdownMenuItem asChild>
                  <Link href={"/"}>
                    <AvatarWithText
                      avatarFallback={"chiop"}
                      primaryText={"masters"}
                      secondaryText={"blasters"}
                      rightSideComponent={
                        <CheckCircle2 className="ml-auto fill-black text-white dark:fill-white dark:text-black" />
                      }
                    />
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="block md:hidden">
                {applicationNavigationMenus.map(({ href, name }) => {
                  return (
                    <DropdownMenuItem key={href} className="text-muted-foreground px-4 py-2" asChild>
                      <Link href={href}>{t(name)}</Link>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              <div className="hidden md:block">
                <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
                  <Link href="/settings/my-account/profile">{t("settings")}</Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuItem
                className="text-destructive/90 hover:!text-destructive px-4 py-2"
                onSelect={async () => signOut({ callbackUrl: "/auth/logout" })}>
                {t("Sign out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
