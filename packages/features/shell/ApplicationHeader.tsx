import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ApplicationHeader = () => {
  const formatAvatarFallback = (teamName?: string) => {
    if (teamName !== undefined) {
      return teamName.slice(0, 1).toUpperCase();
    }
  };

  const menuNavigationLinks = [
    {
      href: `/documents`,
      text: "Home",
    },
    {
      href: `/templates`,
      text: "About",
    },
    {
      href: "/settings/teams",
      text: "Service",
    },
    {
      href: "/settings/profile",
      text: "Contact Us",
    },
  ];
  return <>Waleeds</>;
};
