import { useState } from "react";
import { NextPage } from "next";
import { dump, loadAll } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

type State = {
  json: string;
  yaml: string;
  data?: any;
  lastModified?: "json" | "yaml";
  error?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    json: "",
    yaml: "",
    data: undefined,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="JSON"
          fullWidth
          multiline
          error={state.lastModified === "json" && !!state.error}
          helperText={
            state.lastModified === "json" ? state.error?.toString() : undefined
          }
          value={state.json}
          onChange={(event) => {
            const json = event.target.value;

            const base = {
              json,
              lastModified: "json",
            } as const;

            try {
              const data = JSON.parse(json);

              setState({
                ...base,
                yaml: dump(data),
                data,
              });
            } catch (e) {
              setState({
                ...base,
                yaml: state.yaml,
                error: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="YAML"
          fullWidth
          multiline
          error={state.lastModified === "yaml" && !!state.error}
          helperText={
            state.lastModified === "yaml" ? state.error?.toString() : undefined
          }
          value={state.yaml}
          onChange={(event) => {
            const yaml = event.target.value;

            const base = {
              yaml,
              lastModified: "yaml",
            } as const;

            try {
              const data = loadAll(yaml);

              setState({
                ...base,
                json: JSON.stringify(data[0], undefined, 2),
                data,
              });
            } catch (e) {
              setState({
                ...base,
                json: state.json,
                error: e as Error,
              });
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default _;
