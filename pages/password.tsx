import { useState, WheelEventHandler } from "react";
import { NextPage } from "next";
import cryptoRandomString, { Options } from "crypto-random-string";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import RefreshIcon from "@mui/icons-material/Refresh";
import PasswordIcon from "@mui/icons-material/Password";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "Password Generator",
  description: "Generates passwords.",
  path: "/password",
  icon: <PasswordIcon />,
};

const count = 20;
const minLength = 4;
const maxLength = 200;

const types = ["numeric", "distinguishable", "alphanumeric", "ascii-printable"];

const generate = (options: Options) =>
  new Array(count).fill("").map(() => cryptoRandomString(options));

const defaultOptions: Options = {
  type: "ascii-printable",
  length: 32,
};

type State = {
  options: Options;
  passwords: string[];
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    options: defaultOptions,
    passwords: generate(defaultOptions),
  });

  const handleWheelEvent: WheelEventHandler = (event) => {
    const options: Options = {
      ...state.options,
      length: (() => {
        if (event.deltaY < 0) {
          return Math.max(state.options.length - 1, minLength);
        } else if (event.deltaY > 0) {
          return Math.min(state.options.length + 1, maxLength);
        } else {
          return state.options.length;
        }
      })(),
    };

    setState({ options, passwords: generate(options) });
  };

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() =>
              setState({ ...state, passwords: generate(state.options) })
            }
          >
            Refresh
          </Button>
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={state.options.type}
            exclusive
            onChange={(event, type) => {
              const options = {
                ...state.options,
                type: type ?? state.options.type,
              };

              setState({ options, passwords: generate(options) });
            }}
          >
            {types.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item>
          <Box sx={{ width: 300 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs onWheel={handleWheelEvent}>
                <Slider
                  min={minLength}
                  max={maxLength}
                  value={state.options.length}
                  onChange={(event, newValue) => {
                    const options: Options = {
                      ...state.options,
                      length: newValue as number,
                    };

                    setState({ options, passwords: generate(options) });
                  }}
                  aria-labelledby="length"
                />
              </Grid>
              <Grid item>
                <Input
                  value={state.options.length}
                  size="small"
                  onChange={(event) => {
                    const options: Options = {
                      ...state.options,
                      length: Number(event.target.value),
                    };

                    setState({ options, passwords: generate(options) });
                  }}
                  onBlur={() => {
                    let options: Options = { ...state.options };

                    if (state.options.length < minLength) {
                      options = { ...options, length: minLength };
                    } else if (state.options.length > maxLength) {
                      options = { ...options, length: maxLength };
                    }
                    setState({ options, passwords: generate(options) });
                  }}
                  onWheel={handleWheelEvent}
                  inputProps={{
                    step: 1,
                    min: minLength,
                    max: maxLength,
                    type: "number",
                    "aria-labelledby": "length",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {state.passwords.slice(0, count / 2).map((uuid, i) => (
            <CodeTextField disabled value={uuid} key={i} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {state.passwords.slice(count / 2).map((uuid, i) => (
            <CodeTextField disabled value={uuid} key={i + count / 2} />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
