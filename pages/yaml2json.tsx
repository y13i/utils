import { useState } from "react";
import { NextPage } from "next";
import { loadAll } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

type State = {
  yaml: string;
  data?: any[];
  valid: boolean;
  error?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    yaml: "",
    data: undefined,
    valid: false,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="YAML"
          fullWidth
          multiline
          error={!!state.error}
          helperText={state.error?.toString()}
          value={state.yaml}
          onChange={(event) => {
            const yaml = event.target.value;

            try {
              setState({
                yaml,
                data: loadAll(yaml),
                valid: true,
              });
            } catch (e) {
              setState({
                yaml,
                valid: false,
                error: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={6}>
        {state.data?.map((d, i) => (
          <pre key={`data${i}`}>{JSON.stringify(d, undefined, 2)}</pre>
        ))}
      </Grid>
    </Grid>
  );
};

export default _;
