import { VFC } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export const CodeTextField: VFC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    multiline
    inputProps={{ style: { fontFamily: "monospace" } }}
    {...props}
  />
);
