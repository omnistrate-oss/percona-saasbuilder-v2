import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, ButtonBase, styled } from "@mui/material";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";

export default function SideDrawerRight(props) {
  const {
    open = false,
    closeDrawer,
    RenderUI,
    size = "small",
    containerStyles = {},
  } = props;

  return (
    <Drawer anchor="right" open={open} onClose={closeDrawer}>
      <CloseButton onClick={closeDrawer}>
        <ChevronRightIcon />
      </CloseButton>

      <ContentContainer
        size={size}
        role="presentation"
        sx={{ ...containerStyles }}
      >
        {RenderUI ? RenderUI : ""}
      </ContentContainer>
    </Drawer>
  );
}

const Drawer = styled(MuiDrawer)(() => ({
  [`& .${drawerClasses.paper}`]: {
    // top: 64,
    overflow: "visible",
    marginLeft: 120,
    maxWidth: "calc(100% - 180px)",
  },
}));

const drawerSizes = {
  small: "511px",
  medium: "761px",
  large: "1092px",
  xlarge: "1300px",
};

const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) => !["size"].includes(prop),
})(({ size }) => {
  let drawerWidth = drawerSizes.small;

  if (drawerSizes[size]) {
    drawerWidth = drawerSizes[size];
  }

  return {
    width: drawerWidth,
    maxWidth: "100%",
    padding: "16px 24px",
    position: "relative",
    paddingBottom: 30,
    height: "100%",
    overflowY: "auto",
    scrollbarGutter: "stable",
  };
});

const CloseButton = styled(ButtonBase)(({ theme }) => ({
  height: 56,
  width: 56,
  position: "absolute",
  left: 0,
  top: "50%",
  borderRadius: 100,
  background: "#FFF",
  transform: "translate(calc(-100% - 24px),-100%)",
  zIndex: theme.zIndex.drawer + 1,
}));
