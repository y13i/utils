import { FC, ReactNode } from "react";
import Head from "next/head";

import { appName } from "../lib/constants";

export type WithHeadProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const WithHead: FC<WithHeadProps> = (props) => (
  <>
    <Head>
      <title>{`${appName} - ${props.title}`}</title>
      <meta name="description" content={props.description} />
      <meta property="og:title" content={`${appName} - ${props.title}`} />
      <meta property="og:description" content={props.description} />
      <meta name="twitter:title" content={`${appName} - ${props.title}`} />
      <meta name="twitter:description" content={props.description} />
    </Head>
    {props.children}
  </>
);
