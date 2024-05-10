import { JsonViewer } from "@textea/json-viewer";
import { type JWTPayload, type ProtectedHeaderParameters, decodeJwt, decodeProtectedHeader } from "jose";
import type { NextPage } from "next";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Token } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { debounceWait } from "../lib/constants";
import type { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "JWT Viewer",
  description: "Displays a JWT's header and payload.",
  path: "/jwt",
  icon: <Token />,
};

const Page: NextPage = () => {
  const [jwt, setJwt] = useState<string>("");
  // prettier-ignore
  const [protectedHeader, setProtectedHeader] = useState<ProtectedHeaderParameters | undefined>();
  const [payload, setPayload] = useState<JWTPayload | undefined>();
  const [error, setError] = useState<Error | undefined>(undefined);

  const parseJwtDebounced = useDebouncedCallback((newJwt: string) => {
    try {
      setProtectedHeader(decodeProtectedHeader(newJwt));
      setPayload(decodeJwt(newJwt));
      setError(undefined);
    } catch (e) {
      setError(e as Error);
    }
  }, debounceWait);

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="JWT"
            error={!!error}
            helperText={error?.toString()}
            value={jwt}
            onChange={(event) => {
              const newJwt = event.target.value;
              setJwt(newJwt);
              parseJwtDebounced(newJwt);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" component="h2" gutterBottom>
            Header
          </Typography>
          <JsonViewer
            rootName={false}
            quotesOnKeys={false}
            value={typeof protectedHeader === "object" ? protectedHeader : {}}
          />
          <Typography variant="h6" component="h2" gutterBottom>
            Payload
          </Typography>
          <JsonViewer rootName={false} quotesOnKeys={false} value={typeof payload === "object" ? payload : {}} />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
