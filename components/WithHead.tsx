import { FC, ReactNode } from "react";
import Head from "next/head";

export type WithHeadProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const WithHead: FC<WithHeadProps> = (props) => (
  <>
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
    </Head>
    {props.children}
  </>
);
