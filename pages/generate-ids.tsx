import type { NextPage } from "next";
import { useState } from "react";
import { ulid } from "ulid";
import { v4 as uuid } from "uuid";

import NumbersIcon from "@mui/icons-material/Numbers";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import type { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "Generate IDs",
  description: "Generates UUID and ULID strings.",
  path: "/generate-ids",
  icon: <NumbersIcon />,
};

const count = 20;

const idTypes = ["uuid", "ulid"] as const;
type IdType = (typeof idTypes)[number];

const generate = (kind: IdType) => {
  switch (kind) {
    case "uuid":
      return new Array(count).fill("").map(() => uuid());
    case "ulid":
      return new Array(count).fill("").map(() => ulid());
    default:
      return new Array(count).fill("").map(() => uuid());
  }
};

const Page: NextPage = () => {
  const [idType, setIdType] = useState<IdType>("uuid");
  const [ids, setIds] = useState<string[]>(generate("uuid"));

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button startIcon={<RefreshIcon />} onClick={() => setIds(generate(idType))}>
            Refresh
          </Button>
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={idType}
            exclusive
            onChange={(_, newType) => {
              if (newType === null) {
                return;
              }
              setIdType(newType);
              setIds(generate(newType));
            }}
          >
            {idTypes.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {ids.slice(0, count / 2).map((id, i) => (
            <CodeTextField disabled value={id} key={i} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {ids.slice(count / 2).map((id, i) => (
            <CodeTextField disabled value={id} key={i + count / 2} />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
