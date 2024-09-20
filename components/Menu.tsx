import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import type { FC } from "react";

import { usePageAttributes } from "../lib/usePageAttributes";

export const Menu: FC<{ disableTooltip: boolean }> = (props) => (
  <List>
    {usePageAttributes().map((pageAttribute, i) => (
      <Link key={i} href={pageAttribute.path} passHref>
        <ListItem>
          <Tooltip
            title={pageAttribute.title}
            slotProps={{
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
