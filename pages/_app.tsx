import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import "../src/global.css";
import { AppNavigation } from "../components/AppNavigation";

const queryClient = new QueryClient();

// https://material.io/resources/color/
const theme = createTheme({
  palette: {
    primary: {
      main: "#00838f",
      light: "#4fb3bf",
      dark: "#005662",
      contrastText: "#fff",
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", height: "100%" }}>
          <AppNavigation />
          <Box
            component="main"
            sx={{ px: 3, py: 10, flexGrow: 1, overflow: "auto" }}
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
