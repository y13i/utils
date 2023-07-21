import { useState } from "react";
import { NextPage } from "next";
import { dump, load } from "js-yaml";
import { useDebouncedCallback } from "use-debounce";
import { JsonViewer } from "@textea/json-viewer";
import { sortKeys } from "@y13i/sort-keys";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../lib/usePageAttributes";
import { debounceWait } from "../lib/constants";

export const pageAttribute: PageAttribute = {
  title: "Sort Keys",
  description: "Sorts JSON/YAML keys.",
  path: "/sort-keys",
  icon: <CodeIcon />,
};

const jsonStringifyOptions = [undefined, 2] as const;

const Page: NextPage = () => {
  const [yaml, setYaml] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [newPrioritizeKey, setNewPrioritizeKey] = useState<string>("");
  const [prioritizeKeys, setPrioritizeKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ yaml?: Error }>({});
  const [depth, setDepth] = useState<number>(100);
  const [prioritizePrimitives, setPrioritizePrimitives] =
    useState<boolean>(false);

  const formats = ["YAML", "JSON"] as const;
  const [format, setFormat] = useState<(typeof formats)[number]>(formats[0]);

  const [data, setData] = useState<any>({});

  function refreshOutput(
    option: {
      data?: any;
      format?: (typeof formats)[number];
      depth?: number;
      prioritizeKeys?: string[];
      prioritizePrimitives?: boolean;
    } = {}
  ) {
    const newData = option.data ?? data;

    const sortedData = sortKeys(newData, {
      depth: option.depth ?? depth,
      prioritize: {
        keys: option.prioritizeKeys ?? prioritizeKeys,
        primitives: option.prioritizePrimitives ?? prioritizePrimitives,
      },
    });

    setData(sortedData);

    setOutput(
      (option.format ?? format) === "YAML"
        ? dump(sortedData)
        : JSON.stringify(sortedData, ...jsonStringifyOptions)
    );
  }

  const parseFromYamlDebounced = useDebouncedCallback((newYaml: string) => {
    try {
      const newData: any = load(newYaml);
      refreshOutput({ data: newData });
      setErrors({});
    } catch (e) {
      setErrors({ yaml: e as Error });
    }
  }, debounceWait);

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} xl={4}>
          <Container>
            <FormControlLabel
              control={
                <Checkbox
                  checked={prioritizePrimitives}
                  onChange={(event) => {
                    const newPrioritizePrimitives = event.target.checked;
                    setPrioritizePrimitives(newPrioritizePrimitives);
                    refreshOutput({
                      prioritizePrimitives: newPrioritizePrimitives,
                    });
                  }}
                />
              }
              label="Prioritize Primitives"
            />
          </Container>
          <Container>
            <TextField
              label="Add a prioritized key"
              fullWidth
              value={newPrioritizeKey}
              onChange={(event) => {
                const newKey = event.target.value;
                setNewPrioritizeKey(newKey);
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || event.key !== "Enter") {
                  return;
                }
                const newKey = (event.target as any).value as string;

                if (newKey === "" || prioritizeKeys.includes(newKey)) {
                  return;
                }

                setNewPrioritizeKey("");

                const newPrioritizeKeys = [...prioritizeKeys, newKey];
                setPrioritizeKeys(newPrioritizeKeys);
                refreshOutput({ prioritizeKeys: newPrioritizeKeys });
              }}
            />
          </Container>
          <Container>
            {prioritizeKeys.map((key) => (
              <Chip
                key={key}
                label={key}
                onDelete={() => {
                  const newPrioritizeKeys = prioritizeKeys.filter(
                    (k) => k !== key
                  );
                  setPrioritizeKeys(newPrioritizeKeys);
                  refreshOutput({ prioritizeKeys: newPrioritizeKeys });
                }}
              />
            ))}
          </Container>
          <Container>
            <Slider
              min={0}
              max={100}
              value={depth}
              onChange={(_, value) => {
                const newDepth = value as number;
                setDepth(newDepth);
                refreshOutput({
                  depth: newDepth,
                });
              }}
              aria-labelledby="depth"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `Depth: ${value}`}
            />
          </Container>
          <Container>
            <FormControl fullWidth>
              <InputLabel id="format-select-label">Output Format</InputLabel>
              <Select
                labelId="format-select-label"
                value={format}
                label="Output Format"
                onChange={(event) => {
                  const newFormat = event.target
                    .value as (typeof formats)[number];
                  setFormat(newFormat);
                  refreshOutput({ format: newFormat });
                }}
              >
                {formats.map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Container>
          <Container>
            <CodeTextField
              multiline
              label="Input YAML/JSON"
              error={!!errors.yaml}
              helperText={errors.yaml?.toString()}
              value={yaml}
              onChange={(event) => {
                const newYaml = event.target.value;
                setYaml(newYaml);
                parseFromYamlDebounced(newYaml);
              }}
            />
          </Container>
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <CodeTextField
            multiline
            label="Output"
            value={output}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <JsonViewer
            rootName={false}
            quotesOnKeys={false}
            value={typeof data === "object" ? data : {}}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
