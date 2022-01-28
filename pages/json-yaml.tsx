import { useState } from "react";
import { NextPage } from "next";
import { dump, load } from "js-yaml";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { InteractionProps } from "react-json-view";

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

  const handleViewerUpdate = (p: InteractionProps) => {
    setState({
      json: JSON.stringify(p.updated_src, undefined, 2),
      yaml: dump(p.updated_src),
      data: p.updated_src,
    });
  };

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

              setState({
                yaml,
                json: JSON.stringify(data, undefined, 2),
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
      <Grid item xs={12} md={6} xl={4}>
        <JsonView
          src={state.data}
          onAdd={handleViewerUpdate}
          onEdit={handleViewerUpdate}
          onDelete={handleViewerUpdate}
        />
      </Grid>
    </Grid>
  );
};

export default _;
