import Button from "components/Button/Button";
import TextField from "components/FormElements/TextField/TextField";
import Form from "components/FormElements/Form/Form";
import { IconButton, Stack, styled, Box, Dialog } from "@mui/material";
import LoadingSpinnerSmall from "components/CircularProgress/CircularProgress";
import DeleteCirleIcon from "components/Icons/DeleteCircle/DeleteCirleIcon";
import { Text } from "components/Typography/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { styleConfig } from "src/providerConfig";

function DeleteAccountConfigConfirmationDialog(props) {
  const {
    open = false,
    handleClose,
    formData,
    title = "Delete",
    message = "To confirm deletion, please enter <i><b> deleteme</b></i>, in the field below:",
    buttonLabel = "Delete",
    buttonColor = styleConfig.dangerColor,
    isLoading,
    IconComponent = DeleteCirleIcon,
  } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <StyledForm onSubmit={formData.handleSubmit}>
        <Header>
          <Stack direction="row" alignItems="center" gap="16px">
            <IconComponent />
            <Text size="large" weight="bold">
              {title}
            </Text>
          </Stack>
          <IconButton onClick={handleClose} sx={{ alignSelf: "flex-start" }}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Content>
          <DeleteInstructions />

          <Text
            size="small"
            weight="medium"
            color="#344054"
            mt="9px"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <TextField
            id="deleteme"
            name="deleteme"
            value={formData.values.deleteme}
            onChange={formData.handleChange}
            onBlur={formData.handleBlur}
            sx={{
              marginTop: "16px",
              [`& .Mui-focused .MuiOutlinedInput-notchedOutline`]: {
                borderColor: "rgba(254, 228, 226, 1) !important",
              },
            }}
          />
        </Content>

        <Footer>
          <Button
            variant="outlined"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ height: "40px !important", padding: "10px 14px !important" }}
            disabled={isLoading}
            bgColor={buttonColor}
          >
            {buttonLabel} {isLoading && <LoadingSpinnerSmall />}
          </Button>
        </Footer>
      </StyledForm>
    </Dialog>
  );
}

export default DeleteAccountConfigConfirmationDialog;

const StyledForm = styled(Form)({
  position: "fixed",
  top: "0",
  right: "50%",
  transform: "translateX(50%)",
  background: "white",
  borderRadius: "12px",
  boxShadow:
    "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  padding: "24px",
  width: "100%",
  maxWidth: "550px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const Header = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Content = styled(Box)({
  marginTop: "20px",
  width: "100%",
});

const Footer = styled(Box)({
  marginTop: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "16px",
});

const StyledLink = styled(Link)({
  textDecoration: "underline",
  color: "#7F56D9",
  fontWeight: 700,
  fontStyle: "italic",
});

const DeleteInstructions = () => {
  return (
    <Box width={"100%"} mb="30px">
      <Text size="medium" weight="semibold" color="#374151">
        To off-board your account:
      </Text>

      <List>
        <ListItem>
          <ListItemIcon>
            <ArrowBullet />
          </ListItemIcon>

          <Text size="medium" weight="regular" color="#374151">
            Delete Account Config: Start by deleting the account configuration
            below to remove all artifacts created by Omnistrate.
          </Text>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ArrowBullet />
          </ListItemIcon>

          <Text size="medium" weight="regular" color="#374151">
            <b>Terraform Users:</b> If you set up your account using Terraform,
            execute terraform destroy to revoke our access.{" "}
          </Text>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <ArrowBullet />
          </ListItemIcon>

          <Text size="medium" weight="regular" color="#374151">
            <b>CloudFormation Users (AWS):</b> If you used CloudFormation,
            follow the provided steps{" "}
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.omnistrate.com/getting-started/account-offboarding/"
            >
              here
            </StyledLink>{" "}
            to complete the off-boarding process and revoke our access.
          </Text>
        </ListItem>
      </List>
    </Box>
  );
};

const List = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "8px",
});

const ListItem = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "12px",
});

const ListItemIcon = styled(Box)({
  flexShrink: 0,
});

const ArrowBullet = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.7515 17.6485C8.28287 17.1799 8.28287 16.4201 8.7515 15.9515L12.703 12L8.7515 8.04853C8.28287 7.5799 8.28287 6.8201 8.7515 6.35147C9.22013 5.88284 9.97992 5.88284 10.4486 6.35147L15.2486 11.1515C15.7172 11.6201 15.7172 12.3799 15.2486 12.8485L10.4486 17.6485C9.97992 18.1172 9.22013 18.1172 8.7515 17.6485Z"
      fill="#344054"
    />
  </svg>
);
