import MuiDialog from "@mui/material/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogTitle from "@mui/material/DialogTitle";
import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import Form from "components/FormElements/Form/Form";
import { IconButton, Stack, styled } from "@mui/material";
import LoadingSpinnerSmall from "../CircularProgress/CircularProgress";
import DeleteCirleIcon from "../Icons/DeleteCircle/DeleteCirleIcon";
import { Text } from "../Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { styleConfig } from "src/providerConfig";

export default function TextConfirmationDialog(props) {
  const {
    open = false,
    handleClose,
    formData,
    title = "Delete",
    subtitle = "Are you sure you want to delete?",
    message = "To confirm deletion, please enter <i><b> deleteme</b></i>, in the field below:",
    buttonLabel = "Delete",
    buttonColor = styleConfig.dangerColor,
    isLoading,
    IconComponent = DeleteCirleIcon,
  } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <Form onSubmit={formData.handleSubmit}>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap="16px">
              <IconComponent />
              <Text size="large" weight="bold">
                {title}
              </Text>
            </Stack>
            <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Text size="medium" weight="semibold" mt="20px">
            {subtitle}
          </Text>
          <Text
            size="small"
            weight="medium"
            color="#344054"
            mt="9px"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <TextField
            id="confirmationText"
            name="confirmationText"
            value={formData.values.confirmationText}
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            sx={{
              marginTop: "16px",
              [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
                borderColor: "rgba(254, 228, 226, 1) !important",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            size="large"
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="submit"
            variant="contained"
            disabled={isLoading}
            bgColor={buttonColor}
          >
            {buttonLabel} {isLoading && <LoadingSpinnerSmall />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

const Dialog = styled(MuiDialog)(() => ({
  [`& .MuiPaper-root `]: {
    width: "100%",
    maxWidth: "521px",
    padding: "24px",
  },
}));

const DialogTitle = styled(MuiDialogTitle)(() => ({
  padding: 0,
}));

const DialogContent = styled(MuiDialogContent)(() => ({
  padding: 0,
}));

const DialogActions = styled(MuiDialogActions)(() => ({
  padding: 0,
  paddingTop: 30,
}));
