import { useState } from "react";
import { NextPage } from "next";
import { dump, loadAll } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
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

              setState({
                json,
                yaml: dump(data),
                data,
              });
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
      <Grid item xs={6}>
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
              const data = loadAll(yaml);

              setState({
                yaml,
                json: JSON.stringify(data[0], undefined, 2),
                data,
              });
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
    </Grid>
  );
};

export default _;
