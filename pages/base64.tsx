import { useState, useEffect } from "react";
import { NextPage } from "next";
import { Base64 } from "js-base64";
import Grid from "@mui/material/Grid";

import { encode, decode } from "../utils/codec";
import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";

type State = {
  plain: string;
  base64: string;
  data?: string;
  decodeError?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    plain: "",
    base64: "",
    data: "",
  });

  const updateData = (data: string, plain?: string, base64?: string) => {
    setState({
      data,
      plain: plain ?? data,
      base64: base64 ?? Base64.encode(data),
    });
  };

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get("d");

    if (!encodedData) return;

    (async () => {
      updateData((await decode(encodedData)) as string);
    })();
  }, []);

  useEffect(() => {
    if (state.data === null || state.data === undefined || !window) return;

    (async () => {
      const encodedData = await encode(state.data);
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set("d", encodedData);
      const newUrl = url.origin + url.pathname + "?" + searchParams.toString();

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    })();
  }, [state.data]);

  return (
    <WithHead
      title="JSON/YAML"
      description="Converts JSON/YAML bidirectionally."
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            label="Plain Text"
            value={state.plain}
            onChange={(event) => {
              const plain = event.target.value;
              updateData(plain, plain);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            label="Base64 Encoded"
            error={!!state.decodeError}
            helperText={state.decodeError?.toString()}
            value={state.base64}
            onChange={(event) => {
              const base64 = event.target.value;

              try {
                const data = Base64.decode(base64);
                updateData(data, undefined, base64);
              } catch (e) {
                setState({
                  base64,
                  plain: state.plain,
                  decodeError: e as Error,
                });
              }
            }}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
