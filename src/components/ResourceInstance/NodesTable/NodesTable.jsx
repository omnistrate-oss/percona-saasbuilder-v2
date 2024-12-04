import { Box } from "@mui/material";
import DataGrid from "../../DataGrid/DataGrid";
import { useEffect, useMemo, useState } from "react";
import NodeIcon from "src/components/Icons/NodeIcon/NodeIcon";
import zoneIcon from "public/assets/images/dashboard/resource-instance-nodes/zone.svg";
import Image from "next/image";
import StatusChip from "../../StatusChip/StatusChip";
import { useMutation } from "@tanstack/react-query";
import { failoverResourceInstanceNode } from "../../../api/resourceInstance";
import GridCellExpand from "../../GridCellExpand/GridCellExpand";
import {
  getEnumFromUserRoleString,
  isOperationAllowedByRBAC,
  operationEnum,
  viewEnum,
} from "../../../utils/isAllowedByRBAC";
import { useSelector } from "react-redux";
import { selectUserrootData } from "../../../slices/userDataSlice";
import { NodeStatus } from "./NodeStatus";
import DataGridText from "src/components/DataGrid/DataGridText";
import NodesTableHeader from "./NodesTableHeader";
import {
  getResourceInstanceStatusStylesAndLabel,
  resourceInstanceStatusMap,
} from "src/constants/statusChipStyles/resourceInstanceStatus";
import {
  chipCategoryColors,
  defaultChipStyles,
} from "src/constants/statusChipStyles";
import { productTierTypes } from "src/constants/servicePlan";
import GenerateTokenDialog from "src/components/GenerateToken/GenerateTokenDialog";

const getRowBorderStyles = () => {
  const styles = {};

  for (const status in resourceInstanceStatusMap) {
    const category = resourceInstanceStatusMap[status]?.category;
    let color = chipCategoryColors[category]?.color;
    if (!color) {
      color = defaultChipStyles.color;
    }
    styles[`& .${status}::before`] = {
      content: '""',
      height: "36px",
      width: "4px",
      background: color,
      transform: "translateY(5px)",
      position: "absolute",
    };
  }

  return styles;
};

export default function NodesTable(props) {
  const {
    isInventoryManageInstance,
    isManagedProxy,
    isAccessSide,
    subscriptionData,
    nodes,
    refetchData,
    isRefetching,
    resourceName,
    serviceOffering,
    resourceInstanceId,
    context,
    subscriptionId,
  } = props;
  let sectionLabel = "Resource";
  const isCustomTenancy =
    serviceOffering?.productTierType === productTierTypes.CUSTOM_TENANCY;

  if (context === "inventory") {
    sectionLabel = "Service Component";
  }
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isGenerateTokenDialogOpen, setIsGenerateTokenDialogOpen] =
    useState(false);
  const [dashboardEndpoint, setDashboardEndpoint] = useState("");

  const selectUser = useSelector(selectUserrootData);
  const userEmail = selectUser.email;
  const role = getEnumFromUserRoleString(
    isAccessSide ? subscriptionData?.roleType : selectUser.roleType
  );
  const view = viewEnum.Access_Resources;

  const modifyAccessServiceAllowed = isOperationAllowedByRBAC(
    operationEnum.Update,
    role,
    view
  );
  //remove serverless nodes added on frontend
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => !node.isServerless);
  }, [nodes]);

  const customTenancyColumns = useMemo(() => {
    const res = [
      {
        field: "nodeId",
        headerName: "Node ID",
        flex: 1,
        minWidth: 190,
        renderCell: (params) => {
          const nodeId = params.row.nodeId;
          return (
            <GridCellExpand
              startIcon={<NodeIcon />}
              justifyContent="left"
              value={nodeId}
              textStyles={{
                color: "#475467",
                marginLeft: "4px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
              }}
            />
          );
        },
      },
    ];
    res.push({
      field: "kubernetesDashboardEndpoint",
      headerName: "Dashboard Endpoint",
      flex: 1,
      headerAlign: "left",
      align: "center",
      minWidth: 150,
      renderCell: (params) => {
        const { row } = params;
        const dashboardEndpointRow =
          row.kubernetesDashboardEndpoint?.dashboardEndpoint;
        setDashboardEndpoint(
          row.kubernetesDashboardEndpoint?.dashboardEndpoint
        );
        if (!dashboardEndpointRow) {
          return "-";
        }

        return (
          <GridCellExpand
            value={dashboardEndpointRow}
            href={"https://" + dashboardEndpointRow}
            target="_blank"
            externalLinkArrow
          />
        );
      },
    });
    res.push({
      field: "status",
      headerName: "Lifecycle Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        const statusStylesAndMap = getResourceInstanceStatusStylesAndLabel(
          status?.toUpperCase()
        );
        return <StatusChip status={status} {...statusStylesAndMap} />;
      },
      minWidth: 200,
    });
    return res;
  }, [userEmail]);

  const columns = useMemo(
    () => [
      {
        field: "nodeId",
        headerName: "Node ID",
        flex: 1,
        minWidth: 190,
        renderCell: (params) => {
          const nodeId = params.row.nodeId;
          return (
            <GridCellExpand
              startIcon={<NodeIcon />}
              justifyContent="left"
              value={nodeId}
              textStyles={{
                color: "#475467",
                marginLeft: "4px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
              }}
            />
          );
        },
      },
      {
        field: "resourceName",
        headerName: `${sectionLabel} Name`,
        flex: 0.9,
        minWidth: 100,
      },
      {
        field: "endpoint",
        headerName: "Endpoint",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const endpoint = params.row.endpoint;
          if (!endpoint || endpoint === "-internal") {
            return "-";
          }
          return (
            <DataGridText showCopyButton>{params.row.endpoint}</DataGridText>
          );
        },
      },
      {
        field: "ports",
        headerName: "Ports",
        flex: 0.7,
        minWidth: 100,
        valueGetter: (params) => params.row.ports || "-",
      },
      {
        field: "availabilityZone",
        headerName: "Availability Zone",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const availabilityZone = params.row.availabilityZone;
          return (
            <GridCellExpand
              startIcon={<Image src={zoneIcon} alt="zone" />}
              value={availabilityZone}
              justifyContent="left"
              textStyles={{
                color: "#475467",
                marginLeft: "4px",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
              }}
            />
          );
        },
      },
      {
        field: "status",
        headerName: "Lifecycle Status",
        flex: 0.9,
        renderCell: (params) => {
          const status = params.row.status;
          const statusStylesAndMap =
            getResourceInstanceStatusStylesAndLabel(status);
          return <StatusChip status={status} {...statusStylesAndMap} />;
        },
        minWidth: 200,
      },
      {
        field: "healthStatus",
        headerName: "Health Status",
        flex: 0.9,
        renderCell: (params) => {
          const status = params.row.healthStatus
            ? params.row.healthStatus
            : "UNKNOWN";

          const lifecycleStatus = params.row.status;

          if (lifecycleStatus === "STOPPED")
            return <StatusChip category="unknown" label="N/A" />;

          return (
            <>
              {params.row?.detailedHealth ? (
                <>
                  <NodeStatus
                    detailedHealth={params.row?.detailedHealth}
                    isStopped={params.row.healthStatus === "STOPPED"}
                  />
                </>
              ) : (
                <StatusChip
                  status={status}
                  {...(status === "HEALTHY"
                    ? { pulsateDot: true }
                    : { dot: true })}
                />
              )}
            </>
          );
        },
        minWidth: 180,
      },
    ],
    [sectionLabel]
  );

  const failoverMutation = useMutation(
    (payload) => {
      //if the context is inventory manage instance call failover endpoint of related to
      //invetory otherwise call access related endpoint

      return failoverResourceInstanceNode(payload);
    },
    {
      onSuccess: async () => {
        await refetchData();
        setSelectionModel([]);
      },
    }
  );

  function handleFailover(nodeId, resourceKey) {
    if (serviceOffering && nodeId) {
      failoverMutation.mutate({
        serviceProviderId: serviceOffering?.serviceProviderId,
        serviceKey: serviceOffering?.serviceURLKey,
        serviceAPIVersion: serviceOffering?.serviceAPIVersion,
        serviceEnvironmentKey: serviceOffering?.serviceEnvironmentURLKey,
        serviceModelKey: serviceOffering?.serviceModelURLKey,
        productTierKey: serviceOffering?.productTierURLKey,
        resourceKey: resourceKey,
        instanceId: resourceInstanceId,
        failedReplicaId: nodeId,
        subscriptionId: subscriptionId,
      });
    }
  }

  useEffect(() => {
    if (selectionModel.length > 0) {
      const selectedNodeId = selectionModel[0];
      const node = filteredNodes.find((node) => node.id === selectedNodeId);
      if (node) {
        setSelectedNode(node);
      }
    } else {
      setSelectedNode(null);
    }
  }, [selectionModel, filteredNodes]);

  let isFailoverEnabled = false;

  if (selectedNode && selectedNode.status === "RUNNING") {
    isFailoverEnabled = true;
  }

  return (
    <Box mt={"32px"}>
      <DataGrid
        checkboxSelection={!isCustomTenancy}
        disableColumnMenu
        disableSelectionOnClick
        hideFooterSelectedRowCount
        columns={isCustomTenancy ? customTenancyColumns : columns}
        rows={isRefetching ? [] : filteredNodes}
        components={{
          Header: NodesTableHeader,
        }}
        componentsProps={{
          header: {
            resourceName,
            count: filteredNodes.length,
            refetchData,
            isRefetching,
            isFailoverDisabled:
              !isFailoverEnabled ||
              failoverMutation.isLoading ||
              !modifyAccessServiceAllowed ||
              (isInventoryManageInstance && isManagedProxy), //can't failover fleet instances of type serverless proxy and managedProxyType==="PortsbasedProxy"
            selectedNode,
            showFailoverButton:
              !isCustomTenancy && (isAccessSide || isInventoryManageInstance),
            showGenerateTokenButton: Boolean(
              isCustomTenancy &&
                nodes.some((node) => node.kubernetesDashboardEndpoint)
            ),
            onGenerateTokenClick: () => setIsGenerateTokenDialogOpen(true),
            handleFailover,
            failoverMutation,
          },
        }}
        getRowClassName={(params) => `${params.row.status}`}
        sx={{
          "& .node-ports": {
            color: "#101828",
            fontWeight: 500,
          },
          borderRadius: "8px",

          ...getRowBorderStyles(),
        }}
        selectionModel={selectionModel}
        onSelectionModelChange={(newRowSelectionModel) => {
          if (newRowSelectionModel.length > 0) {
            const selectionSet = new Set(selectionModel);
            const newSelectedItem = newRowSelectionModel.filter(
              (s) => !selectionSet.has(s)
            );
            setSelectionModel(newSelectedItem);
          } else {
            setSelectionModel(newRowSelectionModel);
          }
        }}
        loading={isRefetching}
        noRowsText="No nodes"
      />
      <GenerateTokenDialog
        dashboardEndpoint={dashboardEndpoint}
        open={isGenerateTokenDialogOpen}
        onClose={() => setIsGenerateTokenDialogOpen(false)}
        selectedInstanceId={resourceInstanceId}
        subscriptionId={subscriptionId}
      />
    </Box>
  );
}
