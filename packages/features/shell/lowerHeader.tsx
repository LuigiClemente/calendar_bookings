"use client";

import { useKBar } from "kbar";
import { MenuIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type HTMLAttributes, useEffect, useState } from "react";

import { cn } from "./cn";
import { DesktopNav } from "./desktop-nav";
import { MenuSwitcher } from "./menu-switcher";
import { MobileNavigation } from "./mobile-navigation";

// import SearchButton from './SearchButton';

export type HeaderProps = HTMLAttributes<HTMLDivElement>;

export const OtherHeader = ({ className, ...props }: HeaderProps) => {
  const params = useParams();

  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { query } = useKBar();

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-[1] flex h-16 w-full items-center border-b border-b-transparent backdrop-blur duration-200",
        scrollY > 5 && "border-b-border",
        className
      )}
      {...props}>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-x-4 px-4 md:justify-normal md:px-8">
        <div className="flex items-center md:hidden">
          <Image
            width={168}
            height={50}
            className="-ml-2 h-10 w-full object-contain"
            src="https://res.cloudinary.com/dizm8txou/image/upload/landing-page/assets/day/logo.webp"
            alt="Logo"
          />
        </div>

        <DesktopNav setIsCommandMenuOpen={setIsCommandMenuOpen} />

        <div className="flex gap-x-4 md:hidden">
          <MenuSwitcher />
        </div>

        <div className="flex flex-row items-center space-x-4 md:hidden">
          {/* <SearchButton>
            
        </SearchButton> */}
          <SearchIcon onClick={query.toggle} className="text-muted-foreground h-6 w-6" />

          <button onClick={() => setIsHamburgerMenuOpen(true)}>
            <MenuIcon className="text-muted-foreground h-6 w-6" />
          </button>
          {/* 
          <CommandMenu open={isCommandMenuOpen} onOpenChange={setIsCommandMenuOpen} /> */}

          <MobileNavigation isMenuOpen={isHamburgerMenuOpen} onMenuOpenChange={setIsHamburgerMenuOpen} />
        </div>
      </div>
    </header>
  );
};
