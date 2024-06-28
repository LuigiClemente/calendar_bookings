import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { routes, LocalActiveType } from "../lib/routes";

const useLinks = () => {
  const { t, isLocaleReady, i18n } = useLocale();

  const pathName = usePathname();
  const router = useRouter();
  const locale = i18n.language as LocalActiveType; // Assert the type here

  console.log({ routes, locale, isLocaleReady });

  const menuNavigationLinks = !isLocaleReady
    ? []
    : [
        {
          href: routes[locale]["resources"],
          text: t("Resources"),
        },
        {
          href: routes[locale]["store"],
          text: t("Store"),
        },
        {
          href: routes[locale]["plans"],
          text: t("Plans"),
        },
        {
          href: routes[locale]["appointments"],
          text: t("Appointments"),
        },
        {
          href: routes[locale]["payments"],
          text: t("Payments"),
        },
        {
          href: routes[locale]["documents"],
          text: t("Documents"),
        },
      ];

  return { menuNavigationLinks };
};

export default useLinks;
