import { useState, useCallback } from "react";
import { NextPage } from "next";
import { Base64 } from "js-base64";
import { useDebouncedCallback } from "use-debounce";

import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import CodeIcon from "@mui/icons-material/Code";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { PageAttribute } from "../hooks/usePageAttributes";
import { debounceWait } from "../src/constants";

export const pageAttribute: PageAttribute = {
  title: "Encode/decode",
  description: "(En|De)codes Base64, URI, etc.",
  path: "/encode-decode",
  icon: <CodeIcon />,
};

const _: NextPage = () => {
  const [encoded, setEncoded] = useState("");
  const [encodeError, setEncodeError] = useState<Error | undefined>();
  const [decodeError, setDecodeError] = useState<Error | undefined>();

  const modes = ["Base64", "Base64URI", "URIComponent", "URI"] as const;

  const [mode, setMode] = useSearchParamState<typeof modes[number]>(
    modes[0],
    "m"
  );

  const encode = useCallback(
    (string: string) => {
      if (mode === "Base64") return Base64.encode(string);
      if (mode === "Base64URI") return Base64.encodeURI(string);
      if (mode === "URIComponent") return encodeURIComponent(string);
      if (mode === "URI") return encodeURI(string);
      return "";
    },
    [mode]
  );

  const decode = (string: string) => {
    if (mode === "Base64" || mode === "Base64URI") return Base64.decode(string);
    if (mode === "URIComponent") return decodeURIComponent(string);
    if (mode === "URI") return decodeURI(string);
    return "";
  };

  const [plain, setPlain] = useSearchParamState<string>(
    "",
    "d",
    useCallback(
      (loadedData: string) => {
        setEncoded(encode(loadedData));
      },
      [encode]
    )
  );

  const encodeDebounced = useDebouncedCallback((newPlain) => {
    try {
      setEncoded(encode(newPlain));
      setEncodeError(undefined);
    } catch (e) {
      setEncodeError(e as Error);
    }
  }, debounceWait);

  const decodeDebounced = useDebouncedCallback((newEncoded) => {
    try {
      setPlain(decode(newEncoded));
      setDecodeError(undefined);
    } catch (e) {
      setDecodeError(e as Error);
    }
  }, debounceWait);

  return (
    <WithHead {...pageAttribute}>
      <FormControl>
        <InputLabel id="mode-select-label">Mode</InputLabel>
        <Select
          labelId="mode-select-label"
          value={mode}
          label="Mode"
          onChange={(event) => {
            setMode(event.target.value as typeof modes[number]);
            encodeDebounced(plain);
          }}
        >
          {modes.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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

              setPlain(newPlain);
              encodeDebounced(newPlain);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label={`${mode} Encoded`}
            error={!!decodeError}
            helperText={decodeError?.toString()}
            value={encoded}
            onChange={(event) => {
              const newEncoded = event.target.value;

              setEncoded(newEncoded);
              decodeDebounced(newEncoded);
            }}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
