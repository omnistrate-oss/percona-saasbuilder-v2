import { useState } from "react";
import clipboard from "clipboardy";
import { IconButton } from "@mui/material";
import CopyIcon from "components/Icons/CopyIcon/DataGridCopyIcon";
import Tooltip from "../Tooltip/Tooltip";

const CopyButton = ({
  text = "",
  tooltipProps = {},
  iconProps = {},
  iconButtonProps = {},
  iconStyle = {},
}) => {
  const [tooltipText, setTooltipText] = useState("Click to copy");

  function handleClick() {
    clipboard
      .write(text)
      .then(() => setTooltipText("Copied"))
      .catch(() => setTooltipText("Unable to copy to clipboard"))
      .finally(() => setTimeout(() => setTooltipText("Click to copy"), 1500)); // Reset the tooltip text after copying
  }

  return (
    <Tooltip title={tooltipText} placement="top" {...tooltipProps}>
      <IconButton onClick={handleClick} sx={{ ...iconButtonProps }}>
        <CopyIcon
          color="#2C323E"
          sx={{ width: "16px", height: "18px", ...iconStyle }}
          {...iconProps}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
