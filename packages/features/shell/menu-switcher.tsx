"use client";

import { CheckCircle2, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { applicationNavigationMenus } from "./Shell";
import { AvatarWithText } from "./avatar";
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

export const MenuSwitcher = () => {
  const pathname = usePathname();
  const { status, data } = useSession();
  console.log({ status, data });
  const { t } = useLocale();

  const formatAvatarFallback = (teamName?: string) => {
    if (teamName !== undefined) {
      return teamName.slice(0, 1).toUpperCase();
    }
  };

  if (!data) return null;
  if (!data.user) return null;

  return (
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
        className={cn("z-[60] ml-6 max-h-[70vh] w-full min-w-[320px] overflow-auto md:ml-0")}
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

        <div className="md:none block">
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
  );
};
