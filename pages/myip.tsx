import { NextPage } from "next";
import { useQuery } from "react-query";
import axios from "axios";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import WifiIcon from "@mui/icons-material/Wifi";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "My IP",
  description: "Gets client's global IP address.",
  path: "/myip",
  icon: <WifiIcon />,
};

const ipv6or4Api = "https://myip.y13i.com/";
const ipv4Api = "https://myip4.y13i.com/";

const _: NextPage = () => {
  const {
    data: ipv6or4,
    error: errorIpv6or4,
    isLoading: isLoadingIpv6or4,
    isFetching: isFetchingIpv6or4,
    refetch: refetchIpv6or4,
  } = useQuery<string>("ipv6or4", async () => {
    const { data } = await axios.get(ipv6or4Api);
    return data;
  });

  const {
    data: ipv4,
    error: errorIpv4,
    isLoading: isLoadingIpv4,
    isFetching: isFetchingIpv4,
    refetch: refetchIpv4,
  } = useQuery<string>("ipv4", async () => {
    const { data } = await axios.get(ipv4Api);
    return data;
  });

  return (
    <WithHead {...pageAttribute}>
      <Button
        startIcon={<RefreshIcon />}
        onClick={() => Promise.all([refetchIpv6or4(), refetchIpv4()])}
      >
        Refetch
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            disabled
            label="IPv6 or IPv4"
            value={(() => {
              if (isLoadingIpv6or4) {
                return "Loading...";
              } else if (isFetchingIpv6or4) {
                return "Fetching...";
              } else if (errorIpv6or4) {
                return (errorIpv6or4 as Error)?.toString();
              } else {
                return ipv6or4 ?? "";
              }
            })()}
            error={!!errorIpv6or4}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            disabled
            label="IPv4"
            value={(() => {
              if (isLoadingIpv4) {
                return "Loading...";
              } else if (isFetchingIpv4) {
                return "Fetching...";
              } else if (errorIpv4) {
                return (errorIpv4 as Error)?.toString();
              } else {
                return ipv4 ?? "";
              }
            })()}
            error={!!errorIpv4}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
