import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type { ReactNode, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@calcom/ui";

import { LocalActiveType, routes } from "@lib/routes";

import { Navigation } from "@components/Navigation";
import PageWrapper from "@components/PageWrapper";

import { getServerSideProps } from "@server/lib/forgot-password/getServerSideProps";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

type LanguagesData = {
  [key in LocalActiveType]: any; // Replace 'any' with the actual type of your language data
};

const ForgetPass = ({ languagesData, csrfToken }: { languagesData: LanguagesData; csrfToken: string }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LocalActiveType>("en");
  const [preferredLangData, setPreferredLanguageData] = useState(languagesData[selectedLanguage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const changeLanguage = (locale: LocalActiveType) => {
    window.localStorage.setItem("waleed-intl-locale", locale);
    setPreferredLanguageData(languagesData[locale]);
    setSelectedLanguage(locale);
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
      const locale = window.localStorage.getItem("waleed-intl-locale") as LocalActiveType | null;
      if (locale && locale in languagesData) {
        setPreferredLanguageData(languagesData[locale]);
        setSelectedLanguage(locale);
      } else {
        setSelectedLanguage("en");
        window.localStorage.setItem("waleed-intl-locale", "en");
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

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & { value: string };
    setEmail(target.value);
  };

  const submitForgotPasswordRequest = async ({ email }: { email: string }) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json);
      } else {
        setSuccess(true);
      }

      return json;
    } catch (reason) {
      setError({ message: t("unexpected_error_try_again") });
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleSubmitPasswordRequest = debounce(submitForgotPasswordRequest, 250);

  const onSubmit = async (data: any) => {
    if (!email) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    await debouncedHandleSubmitPasswordRequest({ email: data.email });
  };

  const Success = () => {
    return (
      <div className="space-y-6 text-sm leading-normal">
        <p className="">{t("password_reset_email")}</p>
        <p className="">{t("password_reset_leading")}</p>
        {error && <p className="text-center text-red-600">{error.message}</p>}
        <Button color="secondary" className="w-full justify-center" href="/auth/login">
          {t("back_to_signin")}
        </Button>
      </div>
    );
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
            {success && <Success />}
            {!success && (
              <>
                <div className="space-y-6">{error && <p className="text-red-600">{error.message}</p>}</div>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" value={csrfToken || ""} {...register("csrfToken")} />
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
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message as ReactNode}</p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full bg-[#2ae8d3]" disabled={loading}>
                    {t("forgetPasswordPage.sendResetEmail")}
                  </button>

                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    <Link
                      href="/auth/login2"
                      className="font-medium text-black hover:underline dark:text-black">
                      {t("forgetPasswordPage.backToSignIn")}
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

ForgetPass.PageWrapper = PageWrapper;
export default ForgetPass;

export { getServerSideProps };
