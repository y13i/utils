import { useState, useEffect } from "react";
import { NextPage } from "next";
import { dump, load } from "js-yaml";

import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";

import { encode, decode } from "../utils";
import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../utils";

export const pageAttribute: PageAttribute = {
  title: "JSON/YAML",
  description: "Converts JSON/YAML bidirectionally.",
  path: "/json-yaml",
  icon: <CodeIcon />,
};

const jsonStringifyOptions = [undefined, 2] as const;

const _: NextPage = () => {
  const [data, setData] = useState<any>({});
  const [json, setJson] = useState<string>("");
  const [yaml, setYaml] = useState<string>("");
  const [errors, setErrors] = useState<{ json?: Error; yaml?: Error }>({});

  function setDataWithRefresh(data: any): void {
    setData(data);
    setJson(JSON.stringify(data, ...jsonStringifyOptions));
    setYaml(dump(data));
  }

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get("d");

    if (!encodedData) return;

    (async () => {
      setData(await decode(encodedData));
    })();
  }, []);

  useEffect(() => {
    if (!window) return;

    (async () => {
      const search = await (async () => {
        if (data === undefined || data === null) {
          return "";
        } else {
          const encodedData = await encode(data);
          const searchParams = new URLSearchParams();
          searchParams.set("d", encodedData);
          return `?${searchParams.toString()}`;
        }
      })();

      const url = new URL(window.location.href);
      const newUrl = url.origin + url.pathname + search;

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    })();
  }, [data]);

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
              const inputJson = event.target.value;
              setJson(inputJson);

              try {
                const newData = JSON.parse(inputJson);
                setData(newData);
                setYaml(dump(newData));
              } catch (e) {
                setErrors({ json: e as Error });
              }
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
              const inputYaml = event.target.value;
              setYaml(inputYaml);

              try {
                const newData = load(inputYaml);
                setData(newData);
                setJson(JSON.stringify(newData, ...jsonStringifyOptions));
              } catch (e) {
                setErrors({ yaml: e as Error });
              }
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
