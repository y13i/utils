import { FC } from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";

import { usePageAttributes } from "../hooks/usePageAttributes";

export const Menu: FC<{ disableTooltip: boolean }> = (props) => (
  <List>
    {usePageAttributes().map((pageAttribute, i) => (
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
