import { ReactNode } from "react";

import { pageAttribute as jsonYaml } from "../pages/json-yaml";
import { pageAttribute as sortKeys } from "../pages/sort-keys";
import { pageAttribute as encodeDecode } from "../pages/encode-decode";
import { pageAttribute as jwt } from "../pages/jwt";
import { pageAttribute as myip } from "../pages/myip";
import { pageAttribute as password } from "../pages/password";
import { pageAttribute as qrcode } from "../pages/qrcode";
import { pageAttribute as uuid } from "../pages/uuid";
import { pageAttribute as ulid } from "../pages/ulid";
import { pageAttribute as decoji } from "../pages/decoji";

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};

export function usePageAttributes(): PageAttribute[] {
  return [
    jsonYaml,
    sortKeys,
    encodeDecode,
    jwt,
    myip,
    password,
    qrcode,
    uuid,
    ulid,
    decoji,
  ];
}
