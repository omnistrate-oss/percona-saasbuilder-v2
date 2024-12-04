import * as React from "react";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

const UnCheckedIcon = styled("span")(() => ({
  borderRadius: 4,
  width: 16,
  height: 16,
  border: "1px solid #98A2B3",
  background: "#fff",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#F2F4F7",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "#EAECF0",
  },
}));

const CheckedIcon = styled(UnCheckedIcon)({
  border: "1px solid  #606C86",
  background: "#606C86",
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjY2NjggMy41TDUuMjUwMTYgOS45MTY2N0wyLjMzMzUgNyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==)`,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  "input:hover ~ &": {
    backgroundColor: "rgba(96, 108, 134, 1)",
  },
});

const CustomCheckbox = React.forwardRef(function CustomCheckbox(props, ref) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<CheckedIcon />}
      icon={<UnCheckedIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      ref={ref}
      {...props}
    />
  );
});

export default CustomCheckbox;
