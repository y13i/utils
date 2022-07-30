import { FC, ComponentProps } from "react";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

export const Link: FC<
  ComponentProps<typeof NextLink> & ComponentProps<typeof MuiLink>
> = (props) => {
  const muiLink = <MuiLink {...props}>{props.children}</MuiLink>;

  return props.href.toString().match(/^https?:\/\//) ? (
    muiLink
  ) : (
    <NextLink {...props} passHref>
      {muiLink}
    </NextLink>
  );
};
