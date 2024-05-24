import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { NextPage } from "next";

import RefreshIcon from "@mui/icons-material/Refresh";
import WifiIcon from "@mui/icons-material/Wifi";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import type { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "My IP",
  description: "Gets client's global IP address.",
  path: "/myip",
  icon: <WifiIcon />,
};

const ipv6or4Api = "https://myip.y13i.com/";
const ipv4Api = "https://myip4.y13i.com/";

const Page: NextPage = () => {
  const {
    data: ipv6or4,
    error: errorIpv6or4,
    isLoading: isLoadingIpv6or4,
    isFetching: isFetchingIpv6or4,
    refetch: refetchIpv6or4,
  } = useQuery({
    queryKey: ["ipv6or4"],
    queryFn: async () => {
      return await ky.get(ipv6or4Api).text();
    },
  });

  const {
    data: ipv4,
    error: errorIpv4,
    isLoading: isLoadingIpv4,
    isFetching: isFetchingIpv4,
    refetch: refetchIpv4,
  } = useQuery({
    queryKey: ["ipv4"],
    queryFn: async () => {
      return await ky.get(ipv4Api).text();
    },
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
              if (isLoadingIpv6or4) return "Loading...";
              if (isFetchingIpv6or4) return "Fetching...";
              if (errorIpv6or4) return (errorIpv6or4 as Error)?.toString();
              return ipv6or4 ?? "";
            })()}
            error={!!errorIpv6or4}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            disabled
            label="IPv4"
            value={(() => {
              if (isLoadingIpv4) return "Loading...";
              if (isFetchingIpv4) return "Fetching...";
              if (errorIpv4) return (errorIpv4 as Error)?.toString();
              return ipv4 ?? "";
            })()}
            error={!!errorIpv4}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
