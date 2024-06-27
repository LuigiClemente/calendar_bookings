// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import classNames from "classnames";
// import { signIn } from "next-auth/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { z } from "zod";
// import { ErrorCode } from "@calcom/features/auth/lib/ErrorCode";
// import { HOSTED_CAL_FEATURES, WEBAPP_URL, WEBSITE_URL } from "@calcom/lib/constants";
// import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
// import { useCompatSearchParams } from "@calcom/lib/hooks/useCompatSearchParams";
// import { useLocale } from "@calcom/lib/hooks/useLocale";
// import { collectPageParameters, telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
// import { trpc } from "@calcom/trpc/react";
// import { Alert, Button, EmailField, PasswordField } from "@calcom/ui";
// import type { inferSSRProps } from "@lib/types/inferSSRProps";
// import type { WithNonceProps } from "@lib/withNonce";
// import AddToHomescreen from "@components/AddToHomescreen";
// import PageWrapper from "@components/PageWrapper";
// import BackupCode from "@components/auth/BackupCode";
// import TwoFactor from "@components/auth/TwoFactor";
// import AuthContainer from "@components/ui/AuthContainer";
// import {SAMLLogin} from "@calcom/features/auth/SAMLLogin";
// import { getServerSideProps } from "@server/lib/auth/login/getServerSideProps";
// interface LoginValues {
//   email: string;
//   password: string;
//   totpCode: string;
//   backupCode: string;
//   csrfToken: string;
// }
// const GoogleIcon = () => (
//   <img className="text-subtle mr-2 h-4 w-4 dark:invert" src="/google-icon.svg" alt="" />
// );
// export default function Login({
//   csrfToken,
//   isGoogleLoginEnabled,
//   isSAMLLoginEnabled,
//   samlTenantID,
//   samlProductID,
//   totpEmail,
// }: // eslint-disable-next-line @typescript-eslint/ban-types
// inferSSRProps<typeof getServerSideProps> & WithNonceProps<{}>) {
//   const searchParams = useCompatSearchParams();
//   const { t } = useLocale();
//   const router = useRouter();
//   const formSchema = z
//     .object({
//       email: z
//         .string()
//         .min(1, `${t("error_required_field")}`)
//         .email(`${t("enter_valid_email")}`),
//       ...(!!totpEmail ? {} : { password: z.string().min(1, `${t("error_required_field")}`) }),
//     })
//     // Passthrough other fields like totpCode
//     .passthrough();
//   const methods = useForm<LoginValues>({ resolver: zodResolver(formSchema) });
//   const { register, formState } = methods;
//   const [twoFactorRequired, setTwoFactorRequired] = useState(!!totpEmail || false);
//   const [twoFactorLostAccess, setTwoFactorLostAccess] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const errorMessages: { [key: string]: string } = {
//     [ErrorCode.IncorrectEmailPassword]: t("incorrect_email_password"),
//     [ErrorCode.IncorrectTwoFactorCode]: `${t("incorrect_2fa_code")} ${t("please_try_again")}`,
//     [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t("please_try_again_and_contact_us")}`,
//     [ErrorCode.ThirdPartyIdentityProviderEnabled]: t("account_created_with_identity_provider"),
//   };
//   const telemetry = useTelemetry();
//   let callbackUrl = searchParams?.get("callbackUrl") || "";
//   if (/"\//.test(callbackUrl)) callbackUrl = callbackUrl.substring(1);
//   // If not absolute URL, make it absolute
//   if (!/^https?:\/\//.test(callbackUrl)) {
//     callbackUrl = `${WEBAPP_URL}/${callbackUrl}`;
//   }
//   const safeCallbackUrl = getSafeRedirectUrl(callbackUrl);
//   callbackUrl = safeCallbackUrl || "";
//   const LoginFooter = (
//     <Link href={`${WEBSITE_URL}/signup`} className="text-brand-500 font-medium">
//       {t("dont_have_an_account")}
//     </Link>
//   );
//   const TwoFactorFooter = (
//     <>
//       <Button
//         onClick={() => {
//           if (twoFactorLostAccess) {
//             setTwoFactorLostAccess(false);
//             methods.setValue("backupCode", "");
//           } else {
//             setTwoFactorRequired(false);
//             methods.setValue("totpCode", "");
//           }
//           setErrorMessage(null);
//         }}
//         StartIcon="arrow-left"
//         color="minimal">
//         {t("go_back")}
//       </Button>
//       {!twoFactorLostAccess ? (
//         <Button
//           onClick={() => {
//             setTwoFactorLostAccess(true);
//             setErrorMessage(null);
//             methods.setValue("totpCode", "");
//           }}
//           StartIcon="lock"
//           color="minimal">
//           {t("lost_access")}
//         </Button>
//       ) : null}
//     </>
//   );
//   const ExternalTotpFooter = (
//     <Button
//       onClick={() => {
//         window.location.replace("/");
//       }}
//       color="minimal">
//       {t("cancel")}
//     </Button>
//   );
//   const onSubmit = async (values: LoginValues) => {
//     setErrorMessage(null);
//     telemetry.event(telemetryEventTypes.login, collectPageParameters());
//     const res = await signIn<"credentials">("credentials", {
//       ...values,
//       callbackUrl,
//       redirect: false,
//     });
//     if (!res) setErrorMessage(errorMessages[ErrorCode.InternalServerError]);
//     // we're logged in! let's do a hard refresh to the desired url
//     else if (!res.error) router.push(callbackUrl);
//     else if (res.error === ErrorCode.SecondFactorRequired) setTwoFactorRequired(true);
//     else if (res.error === ErrorCode.IncorrectBackupCode) setErrorMessage(t("incorrect_backup_code"));
//     else if (res.error === ErrorCode.MissingBackupCodes) setErrorMessage(t("missing_backup_codes"));
//     // fallback if error not found
//     else setErrorMessage(errorMessages[res.error] || t("something_went_wrong"));
//   };
//   const { data, isPending, error } = trpc.viewer.public.ssoConnections.useQuery();
//   useEffect(
//     function refactorMeWithoutEffect() {
//       if (error) {
//         setErrorMessage(error.message);
//       }
//     },
//     [error]
//   );
//   const displaySSOLogin = HOSTED_CAL_FEATURES
//     ? true
//     : isSAMLLoginEnabled && !isPending && data?.connectionExists;
//   return (
//     <div className="dark:bg-brand dark:text-brand-contrast text-emphasis min-h-screen [--cal-brand-emphasis:#101010] [--cal-brand-subtle:#9CA3AF] [--cal-brand-text:white] [--cal-brand:#111827] dark:[--cal-brand-emphasis:#e1e1e1] dark:[--cal-brand-text:black] dark:[--cal-brand:white]">
//       <AuthContainer
//         title={t("login")}
//         description={t("login")}
//         showLogo={false}
//         heading={twoFactorRequired ? t("2fa_code") : t("welcome_back")}
//         footerText={
//           twoFactorRequired
//             ? !totpEmail
//               ? TwoFactorFooter
//               : ExternalTotpFooter
//             : process.env.NEXT_PUBLIC_DISABLE_SIGNUP !== "true"
//             ? LoginFooter
//             : null
//         }>
//         <FormProvider {...methods}>
//           <form onSubmit={methods.handleSubmit(onSubmit)} noValidate data-testid="login-form">
//             <div>
//               <input defaultValue={csrfToken || undefined} type="hidden" hidden {...register("csrfToken")} />
//             </div>
//             <div className="space-y-6">
//               <div className={classNames("space-y-6", { hidden: twoFactorRequired })}>
//                 <EmailField
//                   id="email"
//                   label={t("email_address")}
//                   defaultValue={totpEmail || (searchParams?.get("email") as string)}
//                   placeholder="john.doe@example.com"
//                   required
//                   {...register("email")}
//                 />
//                 <div className="relative">
//                   <PasswordField
//                     id="password"
//                     autoComplete="off"
//                     required={!totpEmail}
//                     className="mb-0"
//                     {...register("password")}
//                   />
//                   <div className="absolute -top-[2px] ltr:right-0 rtl:left-0">
//                     <Link
//                       href="/auth/forgot-password"
//                       tabIndex={-1}
//                       className="text-default text-sm font-medium">
//                       {t("forgot")}
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//               {twoFactorRequired ? !twoFactorLostAccess ? <TwoFactor center /> : <BackupCode center /> : null}
//               {errorMessage && <Alert severity="error" title={errorMessage} />}
//               <Button
//                 type="submit"
//                 color="primary"
//                 disabled={formState.isSubmitting}
//                 className="w-full justify-center">
//                 {twoFactorRequired ? t("submit") : t("sign_in")}
//               </Button>
//             </div>
//           </form>
//           {!twoFactorRequired && (
//             <>
//               {(isGoogleLoginEnabled || displaySSOLogin) && <hr className="border-subtle my-8" />}
//               <div className="space-y-3">
//                 {isGoogleLoginEnabled && (
//                   <Button
//                     color="secondary"
//                     className="w-full justify-center"
//                     disabled={formState.isSubmitting}
//                     data-testid="google"
//                     CustomStartIcon={<GoogleIcon />}
//                     onClick={async (e) => {
//                       e.preventDefault();
//                       await signIn("google");
//                     }}>
//                     {t("signin_with_google")}
//                   </Button>
//                 )}
//                 {displaySSOLogin && (
//                   <SAMLLogin
//                     samlTenantID={samlTenantID}
//                     samlProductID={samlProductID}
//                     setErrorMessage={setErrorMessage}
//                   />
//                 )}
//               </div>
//             </>
//           )}
//         </FormProvider>
//       </AuthContainer>
//       <AddToHomescreen />
//     </div>
//   );
// }
// export { getServerSideProps };
// Login.PageWrapper = PageWrapper;
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { inferSSRProps } from "@lib/types/inferSSRProps";
import type { WithNonceProps } from "@lib/withNonce";

import { Navigation } from "@components/Navigation";
import PageWrapper from "@components/PageWrapper";

import { getServerSideProps } from "@server/lib/auth/login/getServerSideProps";

import "../../styles/loginForm.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

interface NonceProps {
  nonce: string;
}

let codeRun = false;
const PageLogin = ({
  languagesData,
  csrfToken,
}: inferSSRProps<typeof getServerSideProps> & WithNonceProps<Record<string, unknown>>) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [preferredLangData, setPrefferedLanguageData] = useState(languagesData[selectedLanguage]);

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

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const changeLanguage = (locale: string) => {
    window.localStorage.setItem("waleed-intl-locale", locale);
    setPrefferedLanguageData(languagesData[locale]);
    setSelectedLanguage(locale);
  };

  const onSubmit = async (data: any) => {
    // Integrate the login logic here
    const res = await signIn<"credentials">("credentials", {
      ...data,
      csrfToken,
      redirect: false,
    });

    if (res?.error) {
      // Handle login error
      console.log("Login error:", res.error);
    } else {
      // Redirect on successful login
      router.push("/");
    }
  };

  const [langBtnState, setLangBtnState] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [isLangBtnHovered, setIsLangBtnHovered] = useState(false);

  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [welcomeBack, setWelcomeBack] = useState(false);

  useEffect(() => {
    if (!codeRun) {
      codeRun = true;
      console.log("Code run Code run");
      if (typeof window !== "undefined") {
        const isReturningUser = window.localStorage.getItem("hasVisitedBefore2");
        console.log({ isReturningUser });
        setWelcomeBack(!!isReturningUser); // Cast the string to a boolean
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
          changeLanguage={changeLanguage as any}
          languageData={preferredLangData}
          selectedLanguage={selectedLanguage}
        />
      </div>
      <div className="cera-pro-font mx-auto mt-[50px] flex flex-col items-center justify-center px-6  py-8 lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {welcomeBack ? t("welcomeBack") : t("welcome")}
            </h1>
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-black text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black sm:text-sm"
                  placeholder={t("welcomeOrWelcomeBackPage.emailPlaceholder")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message as ReactNode}</p>
                )}
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
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message as ReactNode}</p>
                )}
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
