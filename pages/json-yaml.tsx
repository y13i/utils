import { JsonViewer } from "@textea/json-viewer";
import { dump, load } from "js-yaml";
import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import CodeIcon from "@mui/icons-material/Code";
import Grid from "@mui/material/Grid";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { debounceWait } from "../lib/constants";
import type { PageAttribute } from "../lib/usePageAttributes";
import { useSearchParamState } from "../lib/useSearchParamState";

export const pageAttribute: PageAttribute = {
  title: "JSON/YAML",
  description: "Converts JSON/YAML bidirectionally.",
  path: "/json-yaml",
  icon: <CodeIcon />,
};

const jsonStringifyOptions = [undefined, 2] as const;

const Page: NextPage = () => {
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
    useCallback((loadedData: any) => {
      setJson(JSON.stringify(loadedData, ...jsonStringifyOptions));
      setYaml(dump(loadedData));
    }, []),
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
          <JsonViewer
            rootName={false}
            quotesOnKeys={false}
            value={typeof data === "object" ? data : {}}
            onChange={(path, oldValue, newValue) => {
              setDataWithRefresh(newValue);
            }}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
