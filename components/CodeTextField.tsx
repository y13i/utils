import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { type FC, useState } from "react";

export const CodeTextField: FC<TextFieldProps> = (props) => {
  const [copied, setCopied] = useState<boolean>(false);

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
            fontFamily: "monospace",
          },
          endAdornment: (
            <InputAdornment
              position="end"
              sx={props.multiline ? { alignSelf: "flex-start", mt: 1 } : {}}
            >
              <Tooltip
                title={copied ? "Copied!" : "Copy to clipboard"}
                onClose={() => setTimeout(() => setCopied(false), 250)}
              >
                <IconButton
                  aria-label={copied ? "Copied!" : "Copy to clipboard"}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(props?.value as string)
                      .then(() => setCopied(true))
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
