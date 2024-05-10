import Typography from "@mui/material/Typography";
import type { NextPage } from "next";

import { Link } from "../components/Link";
import { WithHead } from "../components/WithHead";
import { appName } from "../lib/constants";
import { usePageAttributes } from "../lib/usePageAttributes";

const Page: NextPage = () => {
  return (
    <WithHead title="Home" description="Collection of handy utilities.">
      <Typography variant="h4" component="h1" gutterBottom>
        {appName}
      </Typography>
      {usePageAttributes().map((pa) => (
        <div key={pa.title}>
          <Typography variant="h5" component="h2" gutterBottom>
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

export default Page;
