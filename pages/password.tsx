import cryptoRandomString, { type Options } from "crypto-random-string";
import type { NextPage } from "next";
import { type WheelEventHandler, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import PasswordIcon from "@mui/icons-material/Password";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { debounceWait } from "../lib/constants";
import type { PageAttribute } from "../lib/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "Password Generator",
  description: "Generates passwords.",
  path: "/password",
  icon: <PasswordIcon />,
};

const count = 20;
const minLength = 4;
const maxLength = 200;

const types = ["numeric", "distinguishable", "alphanumeric", "ascii-printable"] as const;

const generate = (options: Options) =>
  new Array(count).fill("").map(() => cryptoRandomString(options));

const defaultLength = 32;
const defaultPasswordType = types[2];

const Page: NextPage = () => {
  const [length, setLength] = useState(defaultLength);
  const [passwordType, setPasswordType] = useState<(typeof types)[number]>(defaultPasswordType);

  const [passwords, setPasswords] = useState(generate({ type: passwordType, length }));

  const setPasswordsDebounced = useDebouncedCallback(
    (options: Options) => setPasswords(generate(options)),
    debounceWait,
  );

  const handleWheelEvent: WheelEventHandler = (event) => {
    const newLength = (() => {
      if (event.deltaY < 0) return Math.max(length - 1, minLength);
      if (event.deltaY > 0) return Math.min(length + 1, maxLength);
      return length;
    })();

    setLength(newLength);
    setPasswordsDebounced({ type: passwordType, length: newLength });
  };

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => setPasswords(generate({ type: passwordType, length }))}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item>
          <ToggleButtonGroup
            value={passwordType}
            exclusive
            onChange={(_, newType) => {
              if (newType === null) {
                return;
              }
              setPasswordType(newType as (typeof types)[number]);
              setPasswordsDebounced({ type: newType, length });
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
                  value={length}
                  onChange={(_, value) => {
                    const newLength = value as number;
                    setLength(newLength);
                    setPasswordsDebounced({
                      type: passwordType,
                      length: newLength,
                    });
                  }}
                  aria-labelledby="length"
                />
              </Grid>
              <Grid item>
                <Input
                  value={length}
                  size="small"
                  onChange={(event) => {
                    const newLength = Number.parseInt(event.target.value, 10);

                    if (Number.isNaN(newLength) || newLength < minLength || newLength > maxLength) {
                      return;
                    }

                    setLength(newLength);
                    setPasswordsDebounced({
                      type: passwordType,
                      length: newLength,
                    });
                  }}
                  onBlur={() => {
                    if (length < minLength) {
                      setLength(minLength);
                    } else if (length > maxLength) {
                      setLength(maxLength);
                    }
                    setPasswordsDebounced({
                      type: passwordType,
                      length,
                    });
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
          {passwords.slice(0, count / 2).map((password, i) => (
            <CodeTextField disabled value={password} key={password} />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {passwords.slice(count / 2).map((password, i) => (
            <CodeTextField disabled value={password} key={password} />
          ))}
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default Page;
