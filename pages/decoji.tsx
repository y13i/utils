import { NextPage } from "next";
import { decorate, styles } from "decoji";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import Grid from "@mui/material/Grid";
import AbcIcon from "@mui/icons-material/Abc";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { debounceWait } from "../src/constants";

export const pageAttribute: PageAttribute = {
  title: "Decoji",
  description: "Decorates alphanumeric string.",
  path: "/decoji",
  icon: <AbcIcon />,
};

const _: NextPage = () => {
  const [input, setInput] = useSearchParamState<string>(
    "",
    "d",
    useCallback((loadedData) => {
      setDecoratedEntries(
        styles.map((style) => [style.name, decorate(loadedData, style.name)])
      );
    }, [])
  );

  const [decoratedEntries, setDecoratedEntries] = useState(
    styles.map((style) => [style.name, ""])
  );

  const setDecoratedEntriesDebounced = useDebouncedCallback(
    (newInput: string) => {
      setDecoratedEntries(
        styles.map((style) => [style.name, decorate(newInput, style.name)])
      );
    },
    debounceWait
  );

  return (
    <WithHead {...pageAttribute}>
      <CodeTextField
        monospace={false}
        label="Input"
        value={input}
        onChange={(event) => {
          const newInput = event.target.value;
          setInput(newInput);
          setDecoratedEntriesDebounced(newInput);
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {decoratedEntries
            .slice(0, decoratedEntries.length / 2)
            .map(([styleName, decorated], i) => (
              <CodeTextField
                disabled
                label={styleName}
                monospace={false}
                value={decorated}
                key={styleName}
              />
            ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {decoratedEntries
            .slice(decoratedEntries.length / 2)
            .map(([styleName, decorated], i) => (
              <CodeTextField
                disabled
                label={styleName}
                monospace={false}
                value={decorated}
                key={styleName}
              />
            ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
