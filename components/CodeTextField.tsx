import { useState, VFC } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

export const CodeTextField: VFC<TextFieldProps & { monospace?: boolean }> = (
  props
) => {
  const monospace = props.monospace ?? true;

  const [copyMessage, setCopyMessage] = useState<
    "Copy to clipboard" | "Copied!"
  >("Copy to clipboard");

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          text: {
            disabled: "rgba(0, 0, 0, 0.7)",
          },
        },
      })}
    >
      <TextField
        fullWidth
        sx={{
          my: 1,
        }}
        InputProps={{
          sx: {
            ...(monospace ? { fontFamily: "monospace" } : {}),
          },
          endAdornment: (
            <InputAdornment
              position="end"
              sx={props.multiline ? { alignSelf: "flex-start", mt: 1 } : {}}
            >
              <Tooltip
                title={copyMessage}
                onClose={() =>
                  setTimeout(() => setCopyMessage("Copy to clipboard"), 250)
                }
              >
                <IconButton
                  aria-label={copyMessage}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(props?.value as string)
                      .then(() => setCopyMessage("Copied!"))
                  }
                  edge="end"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </ThemeProvider>
  );
};
