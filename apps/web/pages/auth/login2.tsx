"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { inferSSRProps } from "@lib/types/inferSSRProps";
import type { WithNonceProps } from "@lib/withNonce";

import { Navigation } from "@components/Navigation";
import PageWrapper from "@components/PageWrapper";

import { getServerSideProps } from "@server/lib/auth/login/getServerSideProps";

import "../../styles/loginForm.css";

// Define the shape of the language data
interface LanguageData {
  [key: string]: any;
}

type PageLoginProps = inferSSRProps<typeof getServerSideProps> & WithNonceProps<Record<string, unknown>>;
interface PageLoginComponent extends FC<PageLoginProps> {
  PageWrapper?: typeof PageWrapper;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

let codeRun = false;

const PageLogin: PageLoginComponent = ({ languagesData, csrfToken }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [preferredLangData, setPreferredLanguageData] = useState<LanguageData>(
    languagesData[selectedLanguage]
  );

  function t(str: string) {
    const splitArr = str.split(".");
    return splitArr[1] ? preferredLangData[splitArr[0]]?.[splitArr[1]] : preferredLangData[splitArr[0]];
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const locale = window.localStorage.getItem("waleed-intl-locale");
      if (locale && languagesData[locale]) {
        setPreferredLanguageData(languagesData[locale]);
        setSelectedLanguage(locale);
      } else {
        window.localStorage.setItem("waleed-intl-locale", "en");
      }
    }
  }, [languagesData]);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const changeLanguage = (locale: string) => {
    window.localStorage.setItem("waleed-intl-locale", locale);
    setPreferredLanguageData(languagesData[locale]);
    setSelectedLanguage(locale);
  };

  const onSubmit = async (data: LoginFormData) => {
    const res = await signIn<"credentials">("credentials", {
      ...data,
      csrfToken,
      redirect: false,
    });

    if (res?.error) {
      console.log("Login error:", res.error);
    } else {
      router.push("/");
    }
  };

  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState(false);

  useEffect(() => {
    if (!codeRun) {
      codeRun = true;
      if (typeof window !== "undefined") {
        const isReturningUser = window.localStorage.getItem("hasVisitedBefore2");
        setWelcomeBack(!!isReturningUser);
        if (!isReturningUser) {
          window.localStorage.setItem("hasVisitedBefore2", "true");
        }
      }
    }
  }, []);

  return (
    <section>
      <div className="custom-container">
        <Navigation
          navOpen={navOpen}
          langOpen={langOpen}
          setLangOpen={setLangOpen}
          setNavOpen={setNavOpen}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isLangBtnHovered={isLangBtnHovered}
          setIsLangBtnHovered={setIsLangBtnHovered}
          changeLanguage={changeLanguage}
          languageData={preferredLangData}
          selectedLanguage={selectedLanguage as any}
        />
      </div>
      <div className="cera-pro-font mx-auto mt-[50px] flex flex-col items-center justify-center px-6  py-8 lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {welcomeBack ? t("welcomeBack") : t("welcome")}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" value={csrfToken || ""} />
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-light text-gray-900 dark:text-white">
                  {t("welcomeOrWelcomeBackPage.yourEmail")}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-black text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black sm:text-sm"
                  placeholder={t("welcomeOrWelcomeBackPage.emailPlaceholder")}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-light text-gray-900 dark:text-white">
                  {t("welcomeOrWelcomeBackPage.password")}
                </label>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder={t("welcomeOrWelcomeBackPage.passwordPlaceholder")}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-black text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black sm:text-sm"
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div />
                <Link
                  href="/auth/forgot-password2"
                  tabIndex={-1}
                  className="text-sm font-medium text-gray-700 hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>

              <button type="submit" className="btn-primary w-full bg-[#2ae8d3]" disabled={isSubmitting}>
                {t("welcomeOrWelcomeBackPage.signIn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageLogin;
PageLogin.PageWrapper = PageWrapper;

export { getServerSideProps };
