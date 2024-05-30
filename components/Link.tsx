import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import type { ComponentProps, FC } from "react";

export const Link: FC<ComponentProps<typeof NextLink> & ComponentProps<typeof MuiLink>> = (
  props,
) => {
  const muiLinkProps = props.href.toString().match(/^https?:\/\//)
    ? props
    : { ...props, component: NextLink };

  return <MuiLink {...muiLinkProps}>{props.children}</MuiLink>;
};
