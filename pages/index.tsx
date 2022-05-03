import type { NextPage } from "next";
import Link from "next/link";
import Typography from "@mui/material/Typography";

import { WithHead } from "../components/WithHead";

import { usePageAttributes } from "../hooks/usePageAttributes";

const _: NextPage = () => {
  return (
    <WithHead title="Utils" description="Collection of handy utilities.">
      <Typography variant="h1" gutterBottom>
        Utils
      </Typography>
      {usePageAttributes().map((pa) => (
        <div key={pa.title}>
          <Typography variant="h2" gutterBottom>
            <Link href={pa.path} passHref>
              {pa.title}
            </Link>
            {" - "}
            {pa.description}
          </Typography>
        </div>
      ))}
    </WithHead>
  );
};

export default _;
