import { decorate, styles } from "decoji";
import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import AbcIcon from "@mui/icons-material/Abc";
import Grid from "@mui/material/Grid";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { debounceWait } from "../lib/constants";
import type { PageAttribute } from "../lib/usePageAttributes";
import { useSearchParamState } from "../lib/useSearchParamState";

export const pageAttribute: PageAttribute = {
  title: "Decoji",
  description: "Decorates alphanumeric string.",
  path: "/decoji",
  icon: <AbcIcon />,
};

const Page: NextPage = () => {
  const [input, setInput] = useSearchParamState<string>(
    "",
    "d",
    useCallback((loadedData: string) => {
      setDecoratedEntries(styles.map((style) => [style.name, decorate(loadedData, style.name)]));
    }, []),
  );

  const [decoratedEntries, setDecoratedEntries] = useState(styles.map((style) => [style.name, ""]));

  const setDecoratedEntriesDebounced = useDebouncedCallback((newInput: string) => {
    setDecoratedEntries(styles.map((style) => [style.name, decorate(newInput, style.name)]));
  }, debounceWait);

  return (
    <WithHead {...pageAttribute}>
      <CodeTextField
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
              <CodeTextField disabled label={styleName} value={decorated} key={styleName} />
            ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {decoratedEntries.slice(decoratedEntries.length / 2).map(([styleName, decorated], i) => (
            <CodeTextField disabled label={styleName} value={decorated} key={styleName} />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
