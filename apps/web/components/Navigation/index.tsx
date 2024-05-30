import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CiGlobe } from "react-icons/ci";
import { Popover } from "react-tiny-popover";

import { IMAGE_URL } from "@lib/image_url";
import { languages } from "@lib/languages";
import type { LocalActiveType } from "@lib/routes";
import { routes } from "@lib/routes";

import "./navigation.css";

export const Navigation = ({
  navOpen,
  langOpen,
  setLangOpen,
  setNavOpen,
  isHovered,
  setIsHovered,
  isLangBtnHovered,
  setIsLangBtnHovered,
}: {
  navOpen: boolean;
  langOpen: boolean;
  setLangOpen: any;
  setNavOpen: any;
  isHovered: any;
  setIsHovered: any;
  setIsLangBtnHovered: any;
  isLangBtnHovered: any;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const selectedLanguage = "en";
  const [langBtnState, setLangBtnState] = useState(false);

  const t = (text: string) => text; // Temporary translation function
  const languageRoutes: any = {
    en: "/home",
    de: "/startseite",
    nl: "/startpagina",
    fr: "/accueil",
    es: "/inicio",
    pt: "/pagina-inicial",
    it: "/casa",
  };

  const changeLanguage = (langCode: LocalActiveType) => {
    const route = languageRoutes[langCode];
    if (route) {
      document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; samesite=lax`;
      router.push(route);
    }
  };

  return (
    <nav className="dark mx-auto flex w-full items-center justify-between pr-[10px]">
      <div className="relative font-extrabold text-black">
        <Image
          loader={({ src }) => src}
          alt="logo"
          height={70}
          width={120}
          objectFit="contain"
          className="h-[110px] w-[120px] object-contain 2xl:h-[100px] 2xl:w-[150px]"
          src={`${IMAGE_URL}/assets/day/logo.webp`}
        />
        <div className="absolute top-0 z-20 h-full w-full cursor-pointer rounded-full" />
      </div>

      <div className="mr-[10px] flex items-center gap-[25px]">
        <Popover
          isOpen={langOpen}
          positions={["left", "top"]}
          padding={10}
          onClickOutside={() => setLangOpen(false)}
          content={({ position, nudgedLeft, nudgedTop }) => (
            <div className="languages-box">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language ${selectedLanguage === lang.code ? "selected" : ""}`}
                  onClick={() => changeLanguage(lang.code as LocalActiveType)}>
                  <span>{lang.label}</span>
                  <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M20.54 7.225L9.58 18.185l-6.12-6.12 1.415-1.414 4.705 4.706 9.546-9.546z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}>
          <div className={`lang-btn relative cursor-pointer ${isLangBtnHovered ? "hovered" : ""}`}>
            <div
              className="inner-lang-btn absolute z-20 h-full w-full cursor-pointer"
              onMouseEnter={() => setIsLangBtnHovered(true)}
              onMouseLeave={() => setIsLangBtnHovered(false)}
              onClick={() => {
                if (!langBtnState) {
                  setLangBtnState(true);
                  setLangOpen(true);
                } else {
                  setLangBtnState(false);
                  setLangOpen(false);
                }
              }}
            />
            <CiGlobe color="#000000" />
          </div>
        </Popover>
        <div className={`hamburger-container dark relative ${navOpen ? "navOpen" : ""}`}>
          <div
            className="extra-nav absolute z-20 h-full w-full rounded-full duration-[800ms]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setNavOpen(!navOpen)}
          />
          <button className={`menu__icon ${isHovered || navOpen ? "hovered-class" : ""}`}>
            <span />
            <span />
          </button>
        </div>

        <div className={classNames("navigation", "dark")}>
          <input type="checkbox" className="navigation__checkbox" checked={navOpen} id="navi-toggle" />
          <div className={`navigation__background ${navOpen ? "navOpen" : ""}`}>&nbsp;</div>
          <nav className="navigation__nav">
            <div className="custom-container flex min-h-[130px] items-center justify-between">
              <div />
              <div className={`hamburger-container dark relative ${navOpen ? "navOpen" : ""}`}>
                <div
                  className="extra-nav absolute z-20 h-20 w-20 rounded-full duration-[800ms]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setNavOpen(!navOpen)}
                />
                <button className={`menu__icon mr-8 ${isHovered || navOpen ? "hovered-class" : ""}`}>
                  <span />
                  <span />
                </button>
              </div>
            </div>
            <ul className="navigation__list flex flex-col">
              <Link href={routes[selectedLanguage]["home"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("Home")}</span>
              </Link>
              <Link href={routes[selectedLanguage]["about-us"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("About_Us")}</span>
              </Link>
              <Link href={routes[selectedLanguage]["our-studies"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("Our_Studies")}</span>
              </Link>
              <Link href={routes[selectedLanguage]["terms-of-use"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("Terms_of_Service")}</span>
              </Link>
              <Link href={routes[selectedLanguage]["cookies"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("Cookies_Policy")}</span>
              </Link>
              <Link href={routes[selectedLanguage]["privacy"]} className="navigation__item inline-block">
                <span className="navigation__link">{t("Privacy_Policy")}</span>
              </Link>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  );
};
