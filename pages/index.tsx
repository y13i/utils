import type { NextPage } from "next";
import Typography from "@mui/material/Typography";

import { WithHead } from "../components/WithHead";

const _: NextPage = () => {
  return (
    <WithHead title="Utils" description="Collection of handy utilities.">
      <Typography variant="h1" gutterBottom>
        Utils
      </Typography>
    </WithHead>
  );
};

export default _;
