import React, { FC } from "react";
import {
  Box,
  Stack,
  SxProps,
  Theme,
  chipClasses,
  ChipProps as MuiChipProps,
} from "@mui/material";
import _ from "lodash";
import Chip from "../Chip/Chip";
import Dot from "../Dot/Dot";
import TickIcon from "../Icons/Tick/TickIcon";
import { PulsatingDot } from "../PulsatingDot/PulsatingDot";
import {
  Category,
  chipCategoryColors,
} from "src/constants/statusChipStyles/index";

export const statuses = {
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  PENDING_DEPENDENCY: "Pending Dependency",
  PENDING: "Pending",
  RUNNING: "Running",
  DEPLOYING: "Deploying",
  READY: "Ready",
  SUCCESS: "Success",
  COMPLETE: "Complete",
  STOPPED: "Stopped",
  STOPPING: "Stopping",
  HEALTHY: "Healthy",
  UNHEALTHY: "Unhealthy",
  UNKNOWN: "Unknown",
  IN_PROGRESS: "In Progress",
  DELETED: "Deleted",
  PAUSED: "Paused",
  TERMINATED: "Terminated",
  COMPLETED: "Completed",
  NOT_ENABLED: "Not Enabled",
};

export const statusStyles = {
  ACTIVE: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  Active: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  CANCELLED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  COMPLETE: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  COMPLETED: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  DELETING: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  DEPLOYING: {
    backgroundColor: "#FFF4ED",
    color: "#EAAA08",
  },
  DEPRECATED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  Draft: {
    backgroundColor: "#FCFCFC",
    color: "#6F6F6F",
  },
  FAILED: {
    backgroundColor: "#FEF3F2",
    color: "#FA113D",
  },
  DELETED: {
    backgroundColor: "#FEF3F2",
    color: "#FA113D",
  },
  HEALTHY: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  IN_PROGRESS: {
    backgroundColor: "#F8F9FC",
    color: "#669F2A",
  },
  NOT_ENABLED: {
    backgroundColor: "#FEF3F2",
    color: "#C83532",
  },
  Open: {
    backgroundColor: "#EFF8FF",
    color: "#1942C6",
  },
  PAID: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  Paid: {
    backgroundColor: "#ECFDF3",
    color: "#4F9F52",
  },
  PAUSED: {
    backgroundColor: "#FEF3F2",
    color: "#C83532",
  },
  PENDING: {
    backgroundColor: "#EFF8FF",
    color: "#06AED4",
  },
  PENDING_DEPENDENCY: {
    backgroundColor: "#EEF4FF",
    color: "#3538CD",
  },
  PREFERRED: {
    color: "#175CD3",
    backgroundColor: "#EFF8FF",
  },
  Preferred: {
    color: "#175CD3",
    backgroundColor: "#EFF8FF",
  },
  READY: {
    backgroundColor: "#EDFCF2",
    color: "#669F2A",
  },
  RELEASED: {
    backgroundColor: "#ECFDF3",
    color: "#4F9F52",
  },
  RUNNING: {
    backgroundColor: "#ECFDF3",
    color: "#027A48",
  },
  STOPPED: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  STOPPING: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  SUCCESS: {
    backgroundColor: "#ECFDF3",
    color: "#66C61C",
  },
  SUSPENDED: {
    backgroundColor: "#F8EEEE",
    color: "#B42318",
  },
  TERMINATED: {
    backgroundColor: "#FEF3F2",
    color: "#FA113D",
  },
  UNHEALTHY: {
    backgroundColor: "#FEF3F2",
    color: "#B42318",
  },
  UNKNOWN: {
    color: "#363F72",
    borderColor: "#D5D9EB",
    backgroundColor: "#F8F9FC",
  },
  Voided: {
    backgroundColor: "#FEF3F2",
    color: "#C83532",
  },
};

type StatusChipProps = {
  status?: string;
  sx?: SxProps<Theme>;
  fontStyles?: SxProps<Theme>;
  dot?: boolean;
  pulsateDot?: boolean;
  tick?: boolean;
  color?: string;
  bgColor?: string;
  capitalize?: boolean;
  label?: string;
  category?: Category;
  borderColor?: string;
};

type ChipProps = Omit<MuiChipProps, "color">;

const StatusChip: FC<ChipProps & StatusChipProps> = (props) => {
  const {
    status,
    sx = {},
    fontStyles = { fontSize: "12px", lineHeight: "18px" },
    dot,
    pulsateDot,
    tick,
    color,
    bgColor,
    capitalize = true,
    label = statuses[status],
    category,
    borderColor,
    ...restProps
  } = props;
  let chipStyles = null;

  chipStyles = getChipStyles(status);

  if (category) {
    chipStyles = {
      color: chipCategoryColors[category].color,
      backgroundColor: chipCategoryColors[category].bgColor,
    };
  }

  const fontColor = color ? color : chipStyles.color;
  const backgroundColor = bgColor ? bgColor : chipStyles.backgroundColor;

  return (
    <Chip
      label={
        <Stack direction="row" alignItems="center" gap={"5px"}>
          {pulsateDot && <PulsatingDot color={fontColor} />}
          {dot && <Dot color={fontColor} />}
          {tick && <TickIcon />}
          <Box
            component="span"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {label ? label : capitalize ? _.capitalize(status) : status}
          </Box>
        </Stack>
      }
      sx={{
        backgroundColor: backgroundColor,
        [`& .${chipClasses.label}`]: {
          color: fontColor,
          ...fontStyles,
        },
        ...sx,
      }}
      borderColor={borderColor || chipStyles.borderColor}
      {...restProps}
    />
  );
};

export default StatusChip;

export function getChipStyles(resourceInstanceStatus) {
  let chipStyles = statusStyles[resourceInstanceStatus];
  if (!chipStyles) chipStyles = statusStyles["PENDING"];

  return chipStyles;
}
