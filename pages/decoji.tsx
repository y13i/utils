import { useState, useEffect } from "react";
import { NextPage } from "next";
import { decorate, styles } from "decoji";

import Grid from "@mui/material/Grid";
import AbcIcon from "@mui/icons-material/Abc";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute, encode, decode } from "../utils";

export const pageAttribute: PageAttribute = {
  title: "Decoji",
  description: "Decorates alphanumeric string.",
  path: "/decoji",
  icon: <AbcIcon />,
};

const _: NextPage = () => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get("d");

    if (!encodedData) return;

    (async () => {
      setInput((await decode(encodedData)) as string);
    })();
  }, []);

  useEffect(() => {
    if (!window) return;

    (async () => {
      const encodedData = await encode(input);
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set("d", encodedData);
      const newUrl =
        url.origin +
        url.pathname +
        (input.length === 0 ? "" : "?" + searchParams.toString());

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    })();
  }, [input]);

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
