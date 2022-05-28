import { useCallback, useState } from "react";
import { NextPage } from "next";
import { dump, load } from "js-yaml";
import { useDebouncedCallback } from "use-debounce";

import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";

import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { PageAttribute } from "../hooks/usePageAttributes";
import { debounceWait } from "../src/constants";

export const pageAttribute: PageAttribute = {
  title: "JSON/YAML",
  description: "Converts JSON/YAML bidirectionally.",
  path: "/json-yaml",
  icon: <CodeIcon />,
};

const jsonStringifyOptions = [undefined, 2] as const;

const _: NextPage = () => {
  const [json, setJson] = useState<string>("");
  const [yaml, setYaml] = useState<string>("");
  const [errors, setErrors] = useState<{ json?: Error; yaml?: Error }>({});

  const parseFromJsonDebounced = useDebouncedCallback((newJson: string) => {
    try {
      const newData = JSON.parse(newJson);
      setData(newData);
      setYaml(dump(newData));
      setErrors({});
    } catch (e) {
      setErrors({ json: e as Error });
    }
  }, debounceWait);

  const parseFromYamlDebounced = useDebouncedCallback((newYaml: string) => {
    try {
      const newData = load(newYaml);
      setData(newData);
      setJson(JSON.stringify(newData, ...jsonStringifyOptions));
      setErrors({});
    } catch (e) {
      setErrors({ yaml: e as Error });
    }
  }, debounceWait);

  const [data, setData] = useSearchParamState<any>(
    {},
    "d",
    useCallback((loadedData) => {
      setJson(JSON.stringify(loadedData, ...jsonStringifyOptions));
      setYaml(dump(loadedData));
    }, [])
  );

  function setDataWithRefresh(data: any): void {
    setData(data);
    setJson(JSON.stringify(data, ...jsonStringifyOptions));
    setYaml(dump(data));
  }

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} xl={4}>
          <CodeTextField
            multiline
            label="JSON"
            error={!!errors.json}
            helperText={errors.json?.toString()}
            value={json}
            onChange={(event) => {
              const newJson = event.target.value;
              setJson(newJson);
              parseFromJsonDebounced(newJson);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <CodeTextField
            multiline
            label="YAML"
            error={!!errors.yaml}
            helperText={errors.yaml?.toString()}
            value={yaml}
            onChange={(event) => {
              const newYaml = event.target.value;
              setYaml(newYaml);
              parseFromYamlDebounced(newYaml);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <JsonView
            src={typeof data === "object" ? data : {}}
            onAdd={(p) => setDataWithRefresh(p.updated_src)}
            onEdit={(p) => setDataWithRefresh(p.updated_src)}
            onDelete={(p) => setDataWithRefresh(p.updated_src)}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
