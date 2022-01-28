import { useState, useEffect } from "react";
import { NextPage } from "next";
import { dump, load } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { encode, decode } from "../utils/codec";
import { JsonView } from "../components/JsonView";

type State = {
  json: string;
  yaml: string;
  data?: any;
  jsonParseError?: Error;
  yamlParseError?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    json: "",
    yaml: "",
    data: undefined,
  });

  const updateData = (data: any, json?: string, yaml?: string) => {
    setState({
      json: json ?? JSON.stringify(data, undefined, 2),
      yaml: yaml ?? dump(data),
      data,
    });
  };

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get("d");

    if (!encodedData) return;

    (async () => {
      updateData(await decode(encodedData));
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} xl={4}>
        <TextField
          label="JSON"
          fullWidth
          multiline
          error={!!state.jsonParseError}
          helperText={state.jsonParseError?.toString()}
          value={state.json}
          onChange={(event) => {
            const json = event.target.value;

            try {
              const data = JSON.parse(json);
              updateData(data, json);
            } catch (e) {
              setState({
                json,
                yaml: state.yaml,
                jsonParseError: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} xl={4}>
        <TextField
          label="YAML"
          fullWidth
          multiline
          error={!!state.yamlParseError}
          helperText={state.yamlParseError?.toString()}
          value={state.yaml}
          onChange={(event) => {
            const yaml = event.target.value;

            try {
              const data = load(yaml);
              updateData(data, undefined, yaml);
            } catch (e) {
              setState({
                yaml,
                json: state.json,
                yamlParseError: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} xl={4}>
        <JsonView
          src={typeof state.data === "object" ? state.data : {}}
          onAdd={(p) => updateData(p.updated_src)}
          onEdit={(p) => updateData(p.updated_src)}
          onDelete={(p) => updateData(p.updated_src)}
        />
      </Grid>
    </Grid>
  );
};

export default _;
