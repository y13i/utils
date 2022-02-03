import { useState, useCallback } from "react";
import { NextPage } from "next";
import { Base64 } from "js-base64";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { PageAttribute } from "../utils";

export const pageAttribute: PageAttribute = {
  title: "Base64",
  description: "Encode/decode Base64.",
  path: "/base64",
  icon: <CodeIcon />,
};

const _: NextPage = () => {
  const [base64, setBase64] = useState("");
  const [decodeError, setDecodeError] = useState<Error | undefined>();

  const [plain, setPlain] = useSearchParamState<string>(
    "",
    "d",
    useCallback((loadedData) => {
      setBase64(Base64.encode(loadedData));
    }, [])
  );

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="Plain Text"
            value={plain}
            onChange={(event) => {
              const newPlain = event.target.value;
              setPlain(newPlain);
              setBase64(Base64.encode(newPlain));
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="Base64 Encoded"
            error={!!decodeError}
            helperText={decodeError?.toString()}
            value={base64}
            onChange={(event) => {
              const newBase64 = event.target.value;

              try {
                const newPlain = Base64.decode(newBase64);
                setPlain(newPlain);
                setBase64(newBase64);
                setDecodeError(undefined);
              } catch (e) {
                setDecodeError(e as Error);
              }
            }}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
