import { VFC } from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

import { PageAttribute } from "../utils";

import { pageAttribute as base64 } from "./base64";
import { pageAttribute as jsonYaml } from "./json-yaml";
import { pageAttribute as password } from "./password";
import { pageAttribute as uuid } from "./uuid";

const pageAttributes: PageAttribute[] = [base64, jsonYaml, password, uuid];

export const Menu: VFC<{ disableTooltip: boolean }> = (props) => (
  <List>
    {pageAttributes.map((pageAttribute, i) => (
      <Link key={i} href={pageAttribute.path} passHref>
        <ListItem button>
          <Tooltip
            title={pageAttribute.title}
            componentsProps={{
              tooltip: {
                sx: { ...(props.disableTooltip && { display: "none" }) },
              },
            }}
          >
            <ListItemIcon>{pageAttribute.icon}</ListItemIcon>
          </Tooltip>
          <ListItemText primary={pageAttribute.title} />
        </ListItem>
      </Link>
    ))}
  </List>
);
