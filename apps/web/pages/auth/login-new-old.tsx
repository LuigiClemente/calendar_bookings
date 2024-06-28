"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { WEBAPP_URL } from "@calcom/lib/constants";
import { getSafeRedirectUrl } from "@calcom/lib/getSafeRedirectUrl";
import { useCompatSearchParams } from "@calcom/lib/hooks/useCompatSearchParams";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { collectPageParameters, telemetryEventTypes, useTelemetry } from "@calcom/lib/telemetry";
import { Alert, Button, EmailField, PasswordField } from "@calcom/ui";

import PageWrapper from "@components/PageWrapper";
import AuthContainer from "@components/ui/AuthContainer";

type LoginFormValues = {
  email: string;
  password: string;
  csrfToken?: string;
};

type LoginProps = {
  csrfToken?: string | null;
};

export default function Login({ csrfToken = null }: LoginProps) {
  const searchParams = useCompatSearchParams();
  const { t } = useLocale();
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().min(1, t("error_required_field")).email(t("enter_valid_email")),
    password: z.string().min(1, t("error_required_field")),
  });
  const methods = useForm<LoginFormValues>({ resolver: zodResolver(formSchema) });
  const { register, formState } = methods;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const telemetry = useTelemetry();

  let callbackUrl = searchParams?.get("callbackUrl") || "";

  if (/^\//.test(callbackUrl)) callbackUrl = callbackUrl.substring(1);

  // If not absolute URL, make it absolute
  if (!/^https?:\/\//.test(callbackUrl)) {
    callbackUrl = `${WEBAPP_URL}/${callbackUrl}`;
  }

  const safeCallbackUrl = getSafeRedirectUrl(callbackUrl);

  callbackUrl = safeCallbackUrl || "";

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setErrorMessage(null);
    telemetry.event(telemetryEventTypes.login, collectPageParameters());
    const res = await signIn("keycloak", {
      ...values,
      callbackUrl,
      redirect: false,
    });
    if (!res) setErrorMessage(t("something_went_wrong"));
    // we're logged in! let's do a hard refresh to the desired url
    else if (!res.error) router.push(callbackUrl);
    // fallback if error not found
    else setErrorMessage(t("something_went_wrong"));
  };

  return (
    <div className="dark:bg-brand dark:text-brand-contrast text-emphasis min-h-screen">
      <AuthContainer title={t("login")} description={t("login")} showLogo={false} heading={t("welcome_back")}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate data-testid="login-form">
            <div>
              <input defaultValue={csrfToken || undefined} type="hidden" hidden {...register("csrfToken")} />
            </div>
            <div className="space-y-6">
              <EmailField
                id="email"
                label={t("email_address")}
                defaultValue={searchParams?.get("email") as string}
                placeholder="john.doe@example.com"
                required
                {...register("email")}
              />
              <PasswordField
                id="password"
                autoComplete="off"
                required
                className="mb-0"
                {...register("password")}
              />

              {errorMessage && <Alert severity="error" title={errorMessage} />}
              <Button
                type="submit"
                color="primary"
                disabled={formState.isSubmitting}
                className="w-full justify-center">
                {t("sign_in")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </AuthContainer>
    </div>
  );
}

Login.PageWrapper = PageWrapper;
