import type { ReactNode } from "react";

import { pageAttribute as decoji } from "../pages/decoji";
import { pageAttribute as encodeDecode } from "../pages/encode-decode";
import { pageAttribute as generateIds } from "../pages/generate-ids";
import { pageAttribute as jsonYaml } from "../pages/json-yaml";
import { pageAttribute as jwt } from "../pages/jwt";
import { pageAttribute as myip } from "../pages/myip";
import { pageAttribute as password } from "../pages/password";
import { pageAttribute as qrcode } from "../pages/qrcode";
import { pageAttribute as sortKeys } from "../pages/sort-keys";

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};

export function usePageAttributes(): PageAttribute[] {
  return [jsonYaml, sortKeys, encodeDecode, jwt, myip, password, qrcode, generateIds, decoji];
}
