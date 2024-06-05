import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { locales } from "@lib/languages";
import path from "path";
import fs from "fs";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;

  const session = await getServerSession({ req });

  // @TODO res will not be available in future pages (app dir)
  if (session) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return { props: {} };
  }
  const locale = await getLocale(context.req);
  const obj : any= {};
  const updatedArray = locales.map((locale)=>{
  obj[locale] = loadTranslations(locale);
  });
  console.log({updatedArray})
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      languagesData : obj,

      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}



const loadTranslations = (locale:string) => {
  const filePath = path.join(process.cwd(), 'public', 'static', 'locales', locale, 'common.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents);
};