import type { NextPage } from "next";
import { useState } from "react";
import { v4 } from "uuid";

import NumbersIcon from "@mui/icons-material/Numbers";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import type { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "UUIDv4",
  description: "Generates UUIDv4 strings.",
  path: "/uuid",
  icon: <NumbersIcon />,
};

const count = 20;
const generate = () => new Array(count).fill("").map(() => v4());

type State = {
  uuids: string[];
};

const Page: NextPage = () => {
  const [state, setState] = useState<State>({
    uuids: generate(),
  });

  return (
    <WithHead {...pageAttribute}>
      <Button startIcon={<RefreshIcon />} onClick={() => setState({ uuids: generate() })}>
        Refresh
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {state.uuids.slice(0, count / 2).map((uuid, i) => (
            <CodeTextField disabled value={uuid} key={i} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {state.uuids.slice(count / 2).map((uuid, i) => (
            <CodeTextField disabled value={uuid} key={i + count / 2} />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
