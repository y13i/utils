import { useState, useCallback } from "react";
import { NextPage } from "next";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { PageAttribute } from "../utils";

export const pageAttribute: PageAttribute = {
  title: "URI Encode/Decode",
  description: "Encode/decode URI.",
  path: "/uri-encode",
  icon: <CodeIcon />,
};

const _: NextPage = () => {
  const [encoded, setEncoded] = useState("");
  const [encodeError, setEncodeError] = useState<Error | undefined>();
  const [decodeError, setDecodeError] = useState<Error | undefined>();

  const [mode, setMode] = useSearchParamState<"URIComponent" | "URI">(
    "URIComponent",
    "m",
    useCallback((loadedData) => {}, [])
  );

  const [plain, setPlain] = useSearchParamState<string>(
    "",
    "d",
    useCallback((loadedData) => {
      setEncoded(encodeURIComponent(loadedData));
    }, [])
  );

  function encode(string: string): string {
    return mode === "URIComponent"
      ? encodeURIComponent(string)
      : encodeURI(string);
  }

  function decode(string: string): string {
    return mode === "URIComponent"
      ? decodeURIComponent(string)
      : decodeURI(string);
  }

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(event, mode) => {
              setMode(mode as "URIComponent" | "URI");
            }}
          >
            <ToggleButton value="URIComponent">URIComponent</ToggleButton>
            <ToggleButton value="URI">URI</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="Plain Text"
            error={!!encodeError}
            helperText={encodeError?.toString()}
            value={plain}
            onChange={(event) => {
              const newPlain = event.target.value;

              try {
                setPlain(newPlain);
                setEncoded(encode(newPlain));
                setEncodeError(undefined);
              } catch (e) {
                setEncodeError(e as Error);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="URI Encoded"
            error={!!decodeError}
            helperText={decodeError?.toString()}
            value={encoded}
            onChange={(event) => {
              const newEncoded = event.target.value;

              try {
                setPlain(decode(newEncoded));
                setEncoded(newEncoded);
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
