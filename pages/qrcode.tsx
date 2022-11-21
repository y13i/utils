import { useState, useCallback } from "react";
import { NextPage } from "next";
import { useDebouncedCallback } from "use-debounce";
import { toDataURL, QRCodeMaskPattern } from "qrcode";

import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

import QrCodeIcon from "@mui/icons-material/QrCode";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { useSearchParamState } from "../hooks/useSearchParamState";
import { PageAttribute } from "../hooks/usePageAttributes";
import { debounceWait } from "../src/constants";

export const pageAttribute: PageAttribute = {
  title: "QR Code Generator",
  description: "Generates a QR code from string.",
  path: "/qrcode",
  icon: <QrCodeIcon />,
};

const _: NextPage = () => {
  const [dataUrl, setDataUrl] = useState("");
  const [generateError, setGenerateError] = useState<Error | undefined>();

  const errorCorrectionLevels = ["low", "medium", "quartile", "high"] as const;
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useSearchParamState<
    typeof errorCorrectionLevels[number]
  >(errorCorrectionLevels[1], "c");

  const maskPatterns = [
    "auto",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ] as const;
  const [maskPattern, setMaskPattern] = useSearchParamState<
    typeof maskPatterns[number]
  >(maskPatterns[0], "m");

  const generateDataUrl = useCallback(
    async (payload: string) => {
      try {
        setDataUrl(
          await toDataURL(payload, {
            errorCorrectionLevel,
            maskPattern: (maskPattern === "auto"
              ? undefined
              : parseInt(maskPattern)) as QRCodeMaskPattern,
          })
        );
        setGenerateError(undefined);
      } catch (err) {
        setGenerateError(err as Error);
        console.error(err);
      }
    },
    [errorCorrectionLevel, maskPattern]
  );

  const [payload, setPayload] = useSearchParamState<string>(
    "",
    "d",
    useCallback(
      (loadedData: string) => {
        generateDataUrl(loadedData);
      },
      [generateDataUrl]
    )
  );

  const generateDebounced = useDebouncedCallback((newPayload) => {
    generateDataUrl(newPayload);
  }, debounceWait);

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl>
            <InputLabel id="error-correction-level-select-label">
              Error Correction Level
            </InputLabel>
            <Select
              labelId="error-correction-level-select-label"
              value={errorCorrectionLevel}
              label="Error Correction Level"
              onChange={(event) => {
                setErrorCorrectionLevel(
                  event.target.value as typeof errorCorrectionLevels[number]
                );
                generateDebounced(payload);
              }}
            >
              {errorCorrectionLevels.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="mask-pattern-select-label">Mask Pattern</InputLabel>
            <Select
              labelId="mask-pattern-select-label"
              value={maskPattern}
              label="Mask Pattern"
              onChange={(event) => {
                setMaskPattern(
                  event.target.value as typeof maskPatterns[number]
                );
                generateDebounced(payload);
              }}
            >
              {maskPatterns.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <CodeTextField
            multiline
            label="Payload String"
            error={!!generateError}
            helperText={generateError?.toString()}
            value={payload}
            onChange={(event) => {
              const newPayload = event.target.value;

              setPayload(newPayload);
              generateDebounced(newPayload);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia component="img" image={dataUrl} />
          </Card>
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
