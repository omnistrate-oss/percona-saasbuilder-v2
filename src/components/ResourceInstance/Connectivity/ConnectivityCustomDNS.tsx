import { SxProps, styled, Theme, Stack } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import MuiTableCell from "@mui/material/TableCell";
import { Text } from "src/components/Typography/Typography";
import { FC, useEffect, useRef, useState } from "react";
import AccordionEditIcon from "src/components/Icons/AccordionEdit/AccordionEdit";
import Switch from "src/components/Switch/Switch";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import Button from "src/components/Button/Button";
import { useFormik } from "formik";
import {
  addCustomDNSToResourceInstance,
  removeCustomDNSFromResourceInstance,
  getResourceInstanceDetails,
} from "src/api/resourceInstance";

import * as Yup from "yup";
import FieldError from "src/components/FormElementsv2/FieldError/FieldError";
import IconButtonSquare from "src/components/IconButtonSquare/IconButtonSquare";
import EditIcon from "src/components/Icons/Edit/Edit";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import TextConfirmationDialog from "src/components/TextConfirmationDialog/TextConfirmationDialog";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import CustomDNSDetailsModal from "./CustomDNSDetailsModal";
import StatusChip from "src/components/StatusChip/StatusChip";
import { getCustomDNSStatusStylesAndLabel } from "src/constants/statusChipStyles/customDNS";
import { useMutation } from "@tanstack/react-query";
import ViewInstructionsIcon from "src/components/Icons/AccountConfig/ViewInstrcutionsIcon";
import { styleConfig } from "src/providerConfig";

export type AddCustomDNSToResourceInstancePayload = {
  customDNS: string;
  targetPort?: number;
};
const TableCell = styled(MuiTableCell)({
  borderBottom: "none",
});

type ResourceConnectivityEndpointProps = {
  containerStyles: SxProps<Theme>;
  resourceKey: string;
  resourceId: string;
  resourceHasCompute: boolean;
  customDNSData?: {
    enabled: boolean;
    dnsName?: string;
    status?: string;
    cnameTarget?: string;
    aRecordTarget?: string;
  };
  queryData: {
    serviceProviderId: string;
    serviceKey: string;
    serviceAPIVersion: string;
    serviceEnvironmentKey: string;
    serviceModelKey: string;
    productTierKey: string;
    subscriptionId: string;
    resourceInstanceId: string;
  };
  refetchInstance: () => void;
};

const ResourceConnectivityCustomDNS: FC<ResourceConnectivityEndpointProps> = (
  props
) => {
  const {
    customDNSData = { enabled: false },
    queryData,
    resourceKey,
    resourceId,
    refetchInstance,
    resourceHasCompute,
  } = props;

  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] =
    useState(false);
  const [showConfigurationDialog, setShowConfigurationDialog] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isTextfieldDisabled, setIsTextFieldDisabled] = useState(false);
  const [shouldShowConfigDialog, setShouldShowConfigDialog] = useState(false);
  const [isVerifyingDNSRemoval, setIsVerifyingDNSRemoval] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textfieldRef = useRef<HTMLInputElement>();
  const timeoutID = useRef(null);
  const pollCount = useRef(0);

  const { dnsName } = customDNSData;
  let isCustomDNSSetup = false;
  if (dnsName) {
    isCustomDNSSetup = true;
  }
  const [isToggleChecked, setIsToggleChecked] = useState(isCustomDNSSetup);

  const addCustomDNSMutation = useMutation({
    mutationFn: (payload: AddCustomDNSToResourceInstancePayload) => {
      return addCustomDNSToResourceInstance(
        queryData.serviceProviderId,
        queryData.serviceKey,
        queryData.serviceAPIVersion,
        queryData.serviceEnvironmentKey,
        queryData.serviceModelKey,
        queryData.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId,
        payload
      );
    },
    onSuccess: () => {
      refetchInstance();
    },
  });

  const removeCustomDNSMutation = useMutation({
    mutationFn: () => {
      return removeCustomDNSFromResourceInstance(
        queryData.serviceProviderId,
        queryData.serviceKey,
        queryData.serviceAPIVersion,
        queryData.serviceEnvironmentKey,
        queryData.serviceModelKey,
        queryData.productTierKey,
        resourceKey,
        queryData.resourceInstanceId,
        queryData.subscriptionId
      );
    },
    onSuccess: () => {
      pollInstanceQueryToVerifyDNSRemoval();
    },
  });

  function clearExistingTimeout() {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  }

  function pollInstanceQueryToVerifyDNSRemoval() {
    setIsVerifyingDNSRemoval(true);
    clearExistingTimeout();
    pollCount.current = 0;
    verifyDNSRemoval();

    function verifyDNSRemoval() {
      if (pollCount.current < 5) {
        pollCount.current++;
        const id = setTimeout(() => {
          getResourceInstanceDetails(
            queryData.serviceProviderId,
            queryData.serviceKey,
            queryData.serviceAPIVersion,
            queryData.serviceEnvironmentKey,
            queryData.serviceModelKey,
            queryData.productTierKey,
            resourceKey,
            queryData.resourceInstanceId,
            queryData.subscriptionId
          )
            .then((response) => {
              const topologyDetails =
                response.data?.detailedNetworkTopology?.[resourceId];
              //check for dnsName field in the response, absence means dns removal complete
              if (!Boolean(topologyDetails?.customDNSEndpoint.dnsName)) {
                setIsVerifyingDNSRemoval(false);
                refetchInstance();
              } else {
                verifyDNSRemoval();
              }
            })
            .catch(() => {
              verifyDNSRemoval();
            });
        }, 1500);
        timeoutID.current = id;
      } else {
        setIsVerifyingDNSRemoval(false);
      }
    }
  }

  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);

  const customDNSFormik = useFormik({
    initialValues: {
      customDNSEndpoint: dnsName ?? "",
    },
    onSubmit: (values) => {
      handleAddDNS({
        customDNS: values.customDNSEndpoint,
      });
    },
    validationSchema: Yup.object().shape({
      customDNSEndpoint: Yup.string()
        //.url("Please enter a valid URL")
        .required("Target Alias is required"),
    }),
    enableReinitialize: true,
  });

  const removeCustomDNSFormik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async (values) => {
      if (values.confirmationText === "deleteme") {
        try {
          await removeCustomDNSMutation?.mutateAsync();
          setShowDeleteConfirmationDialog(false);
          removeCustomDNSFormik.resetForm();
        } catch {}
      }
    },
  });

  async function handleAddDNS(payload: AddCustomDNSToResourceInstancePayload) {
    try {
      await addCustomDNSMutation?.mutateAsync(payload);
      setShouldShowConfigDialog(true);
      setIsTextFieldDisabled(true);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (customDNSData.enabled === true && customDNSData.dnsName) {
      setIsTextFieldDisabled(true);
    } else if (customDNSData.enabled === true && !customDNSData.dnsName) {
      setIsTextFieldDisabled(false);
      setIsToggleChecked(false);
    }
  }, [customDNSData]);

  useEffect(() => {
    if (isCustomDNSSetup && shouldShowConfigDialog) {
      setShowConfigurationDialog(true);
      setShouldShowConfigDialog(false);
    }
  }, [isCustomDNSSetup, shouldShowConfigDialog, setShouldShowConfigDialog]);

  function handleSwitchToggle(e) {
    const isChecked = !e.target.checked;
    if (isChecked) {
      //disable toggle if dns is not setup
      if (!isCustomDNSSetup) {
        setIsToggleChecked(false);
      } else {
        setDeleteMessage(
          "Disabling will delete endpoint alias. Are you sure you want to continue?"
        );
        setShowDeleteConfirmationDialog(true);
      }
    } else {
      setIsToggleChecked(true);
    }
  }

  const statusStylesAndLabel = getCustomDNSStatusStylesAndLabel(
    customDNSData?.status
  );

  return (
    <>
      {resourceHasCompute && customDNSData?.enabled && (
        <>
          <TableRow>
            <TableCell align="center" sx={{ paddingRight: "8px" }}>
              <AccordionEditIcon color="#0B4A8C" />
            </TableCell>
            <TableCell colSpan={2} sx={{ paddingLeft: "4px" }}>
              <Stack direction="row" alignItems="center" gap="10px">
                <Text color="#0B4A8C" weight="medium" size="small">
                  Configure Endpoint Alias
                </Text>
                <Switch
                  checked={isToggleChecked}
                  onChange={handleSwitchToggle}
                />
                {isCustomDNSSetup && (
                  <StatusChip
                    {...statusStylesAndLabel}
                    pulsateDot={Boolean(customDNSData?.status === "PENDING")}
                  />
                )}
                {isVerifyingDNSRemoval && <LoadingSpinnerSmall />}
              </Stack>
            </TableCell>
          </TableRow>
          {isToggleChecked && (
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  paddingRight: "8px",
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              />
              <TableCell colSpan={2} sx={{ paddingLeft: "4px", paddingTop: 0 }}>
                <FieldContainer marginTop={0} sx={{ maxWidth: "510px" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="6px"
                    marginTop="6px"
                  >
                    <TextField
                      //@ts-ignore
                      marginTop="0px"
                      name="customDNSEndpoint"
                      onChange={customDNSFormik.handleChange}
                      onBlur={customDNSFormik.handleBlur}
                      value={customDNSFormik.values.customDNSEndpoint}
                      disabled={isTextfieldDisabled}
                      ref={textfieldRef}
                      copyButton={isTextfieldDisabled}
                    />
                    {isTextfieldDisabled ? (
                      <>
                        <IconButtonSquare
                          onClick={() => {
                            setShowConfigurationDialog(true);
                          }}
                        >
                          <ViewInstructionsIcon color="#0B4A8C" />
                        </IconButtonSquare>
                        <IconButtonSquare
                          onClick={() => {
                            setIsTextFieldDisabled(false);
                            //textfieldRef.current.focus();
                            setIsEditing(true);
                          }}
                        >
                          <EditIcon color="#0B4A8C" />
                        </IconButtonSquare>
                        <IconButtonSquare
                          sx={{ borderColor: "#FDA29B !important" }}
                          onClick={() => {
                            setDeleteMessage(
                              "Are you sure you want to delete this endpoint alias?"
                            );
                            setShowDeleteConfirmationDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButtonSquare>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#039855 !important",
                          }}
                          onClick={() => {
                            customDNSFormik.submitForm();
                          }}
                        >
                          Verify{" "}
                          {addCustomDNSMutation?.isLoading && (
                            <LoadingSpinnerSmall />
                          )}
                        </Button>
                        {isEditing && (
                          <Button
                            variant="outlined"
                            sx={{
                              color: `${styleConfig.dangerColor} !important`,
                            }}
                            onClick={() => {
                              customDNSFormik.resetForm();
                              setIsEditing(false);
                              setIsTextFieldDisabled(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                  <FieldError>
                    {customDNSFormik.touched.customDNSEndpoint &&
                      customDNSFormik.errors.customDNSEndpoint}
                  </FieldError>
                </FieldContainer>
              </TableCell>
            </TableRow>
          )}
        </>
      )}

      {isCustomDNSSetup && (
        <TextConfirmationDialog
          open={showDeleteConfirmationDialog}
          handleClose={() => {
            setShowDeleteConfirmationDialog(false);
            removeCustomDNSFormik.resetForm();
          }}
          formData={removeCustomDNSFormik}
          title={`Delete Endpoint Alias`}
          subtitle={deleteMessage}
          message={
            "To confirm deletion, please enter <b>deleteme</b>, in the field below:"
          }
          isLoading={removeCustomDNSMutation?.isLoading}
          isDeleteEnable={true}
        />
      )}
      <CustomDNSDetailsModal
        open={showConfigurationDialog}
        aRecordTarget={customDNSData?.aRecordTarget}
        cnameTarget={customDNSData?.cnameTarget}
        domainName={customDNSData?.dnsName}
        handleClose={() => {
          setShowConfigurationDialog(false);
        }}
      />
    </>
  );
};

export default ResourceConnectivityCustomDNS;
