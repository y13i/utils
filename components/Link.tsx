import { FC, ComponentProps } from "react";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

export const Link: FC<
  ComponentProps<typeof NextLink> & ComponentProps<typeof MuiLink>
> = (props) => {
  const muiLinkProps = props.href.toString().match(/^https?:\/\//)
    ? props
    : { ...props, component: NextLink };

  return <MuiLink {...muiLinkProps}>{props.children}</MuiLink>;
};
