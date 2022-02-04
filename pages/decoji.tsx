import { NextPage } from "next";
import { decorate, styles } from "decoji";

import Grid from "@mui/material/Grid";
import AbcIcon from "@mui/icons-material/Abc";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../utils";
import { useSearchParamState } from "../hooks/useSearchParamState";

export const pageAttribute: PageAttribute = {
  title: "Decoji",
  description: "Decorates alphanumeric string.",
  path: "/decoji",
  icon: <AbcIcon />,
};

const _: NextPage = () => {
  const [input, setInput] = useSearchParamState<string>("");

  return (
    <WithHead {...pageAttribute}>
      <CodeTextField
        monospace={false}
        label="Input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {styles.slice(0, styles.length / 2).map((style, i) => (
            <CodeTextField
              disabled
              label={style.name}
              monospace={false}
              value={decorate(input, style.name)}
              key={i}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {styles.slice(styles.length / 2).map((style, i) => (
            <CodeTextField
              disabled
              label={style.name}
              monospace={false}
              value={decorate(input, style.name)}
              key={i + styles.length / 2}
            />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
