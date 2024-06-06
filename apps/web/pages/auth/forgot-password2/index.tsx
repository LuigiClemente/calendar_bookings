// PageLogin.js
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type inferSSRProps } from "@lib/types/inferSSRProps";

import { Navigation } from "@components/Navigation";
import PageWrapper from "@components/PageWrapper";

import { getServerSideProps } from "@server/lib/forgot-password/getServerSideProps";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgetPass = ({ languagesData }: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [preferredLangData, setPrefferedLanguageData] = useState(languagesData[selectedLanguage]);
  const changeLanguage = (locale: string) => {
    window.localStorage.setItem("waleed-intl-locale", locale);
    setPrefferedLanguageData(languagesData[locale]);

    setSelectedLanguage(locale);
    console.log({ locale });
    console.log({ selectedLanguage });
  };
  function t(str: string) {
    const splitArr = str.split(".");

    if (splitArr[1]) {
      return preferredLangData[splitArr[0]][splitArr[1]];
    } else {
      return preferredLangData[splitArr[0]];
    }
  }
  useEffect(() => {
    if (typeof window !== undefined) {
      const locale = window.localStorage.getItem("waleed-intl-locale");
      if (locale) {
        setPrefferedLanguageData(languagesData[locale]);
        setSelectedLanguage(locale);
      } else {
        window.localStorage.getItem("en");
      }
    }
  }, [languagesData]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = (data: any) => {
    // Handle your login logic here
    console.log("Form submitted:", data);
    // loginCheck(data.email , data.password);
  };
  const [langBtnState, setLangBtnState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);

  const [langOpen, setLangOpen] = useState<boolean>(false);
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
          languageData={preferredLangData}
          selectedLanguage={selectedLanguage}
          changeLanguage={changeLanguage}
        />
      </div>
      <div className="cera-pro-font mx-auto mt-[50px] flex flex-col items-center justify-center px-6 py-8 lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {t("forgetPasswordPage.title")}
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black sm:text-sm"
                  placeholder={t("welcomeOrWelcomeBackPage.emailPlaceholder")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message as ReactNode}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full bg-[#2ae8d3] ">
                {t("forgetPasswordPage.sendResetEmail")}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <Link href="/auth/login2" className="font-medium text-black hover:underline dark:text-black">
                  {t("forgetPasswordPage.backToSignIn")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

ForgetPass.PageWrapper = PageWrapper;
export default ForgetPass;

export { getServerSideProps };
