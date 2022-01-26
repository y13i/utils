import { useState } from "react";
import { NextPage } from "next";
import { dump } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

type State = {
  json: string;
  data?: any;
  valid: boolean;
  error?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    json: "",
    data: undefined,
    valid: false,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="JSON"
          fullWidth
          multiline
          error={!!state.error}
          helperText={state.error?.toString()}
          value={state.json}
          onChange={(event) => {
            const json = event.target.value;

            try {
              setState({
                json,
                data: JSON.parse(json),
                valid: true,
              });
            } catch (e) {
              setState({
                json,
                valid: false,
                error: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <pre>{dump(state.data)}</pre>
      </Grid>
    </Grid>
  );
};

export default _;
