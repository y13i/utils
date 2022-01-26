import { useState } from "react";
import { NextPage } from "next";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { JsonView } from "../components/JsonView";

type State = {
  json: string;
  data: any;
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
              setState({ json, data: JSON.parse(json), valid: true });
            } catch (e) {
              setState({
                json,
                data: undefined,
                valid: false,
                error: e as Error,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <JsonView src={state.data} />
      </Grid>
    </Grid>
  );
};

export default _;
