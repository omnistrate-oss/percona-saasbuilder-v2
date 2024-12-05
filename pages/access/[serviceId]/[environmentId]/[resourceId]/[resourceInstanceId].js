import { useRouter } from "next/router";
import DashboardLayout from "src/components/DashboardLayout/DashboardLayout";
import MarketplaceServiceSidebar, {
  sidebarActiveOptions,
} from "src/components/MarketplaceServiceSidebar/MarketplaceServiceSidebar";
import useServiceOffering from "src/hooks/useServiceOffering";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import { Tabs, Tab } from "src/components/Tab/Tab";
import { useEffect, useMemo, useState } from "react";
import NodesTable from "src/components/ResourceInstance/NodesTable/NodesTable";
import { Collapse, Stack } from "@mui/material";
import Button from "src/components/Button/Button";
import { RiArrowGoBackFill } from "react-icons/ri";
import Connectivity from "src/components/ResourceInstance/Connectivity/Connectivity";
import useResourceInstance from "src/hooks/useResourceInstance";
import Metrics from "src/components/ResourceInstance/Metrics/Metrics";
import Logs from "src/components/ResourceInstance/Logs/Logs";
import ResourceInstanceDetails from "src/components/ResourceInstance/ResourceInstanceDetails/ResourceInstanceDetails";
import useServiceOfferingResourceSchema from "src/hooks/useServiceOfferingResourceSchema";
import Head from "next/head";
import SideDrawerRight from "src/components/SideDrawerRight/SideDrawerRight";
import { AccessSupport } from "src/components/Access/AccessSupport";
import {
  getAPIDocsRoute,
  getMarketplaceRoute,
  getResourceInstancesDetailsRoute,
  getResourceInstancesDetailswithKeyRoute,
  getResourceInstancesRoute,
} from "src/utils/route/access/accessRoute";
import useSubscriptionForProductTierAccess from "src/hooks/query/useSubscriptionForProductTierAccess";
import SubscriptionNotFoundUI from "src/components/Access/SubscriptionNotFoundUI";
import { checkIfResouceIsBYOA } from "src/utils/access/byoaResource";
import Link from "next/link";
import { CLI_MANAGED_RESOURCES, RESOURCE_TYPES } from "src/constants/resource";
import AuditLogs from "src/components/ResourceInstance/AuditLogs/AuditLogs";
import ResourceInstanceOverview from "src/components/ResourceInstance/ResourceInstanceOverview/ResourceInstanceOverview";
import Backup from "src/components/ResourceInstance/Backup/Backup";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styleConfig } from "src/providerConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInstanceDetailsSummaryVisibility,
  toggleInstanceDetailsSummaryVisibility,
} from "src/slices/genericSlice";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

function ResourceInstance() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("Resource Instance Details");
  const {
    serviceId,
    environmentId,
    view,
    source,
    resourceInstanceId,
    resourceId,
    productTierId,
    subscriptionId,
  } = router.query;
  const { data: serviceOffering, isLoading: isServiceOfferingLoading } =
    useServiceOffering(serviceId, productTierId);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [currentTabValue, setCurrentTabValue] = useState(false);
  const [currentSource, setCurrentSource] = useState("");
  const insightsVisible = useSelector(selectInstanceDetailsSummaryVisibility);
  const dispatch = useDispatch();

  let resourceName = "";
  let resourceKey = "";
  let resourceType = "";

  if (serviceOffering && resourceId) {
    const resource = serviceOffering.resourceParameters?.find(
      (resource) => resource.resourceId === resourceId
    );
    if (resource) {
      resourceName = resource.name;
      resourceKey = resource.urlKey;
      resourceType = resource.resourceType;
    }
  }

  const isResourceBYOA = useMemo(() => {
    return checkIfResouceIsBYOA(resourceId);
  }, [resourceId]);

  useEffect(() => {
    if (source) {
      setCurrentSource(source);
    }
  }, [source]);

  const subscriptionQuery = useSubscriptionForProductTierAccess(
    serviceId,
    productTierId,
    subscriptionId
  );
  const { data: subscriptionData = {}, isLoading: isLoadingSubscription } =
    subscriptionQuery;

  const resourceInstanceQuery = useResourceInstance(
    serviceOffering?.serviceProviderId,
    serviceOffering?.serviceURLKey,
    serviceOffering?.serviceAPIVersion,
    serviceOffering?.serviceEnvironmentURLKey,
    serviceOffering?.serviceModelURLKey,
    serviceOffering?.productTierURLKey,
    resourceKey,
    resourceInstanceId,
    resourceId,
    subscriptionData?.id
  );
  const { data: resourceInstanceData } = resourceInstanceQuery;

  const closeSupportDrawer = () => {
    setSupportDrawerOpen(false);
  };

  const isLoading =
    !router.isReady ||
    isServiceOfferingLoading ||
    resourceInstanceQuery.isLoading ||
    resourceInstanceQuery.isIdle;

  const resourceSchemaQuery = useServiceOfferingResourceSchema(
    serviceId,
    resourceId,
    resourceInstanceId
  );
  const resourceInstancesUrl = getResourceInstancesRoute(
    serviceId,
    environmentId,
    productTierId,
    resourceId,
    currentSource,
    subscriptionData?.id
  );

  const isCliManagedResource = useMemo(
    () => CLI_MANAGED_RESOURCES.includes(resourceType),

    [resourceType]
  );

  const tabs = getTabs(
    resourceInstanceData?.isMetricsEnabled,
    resourceInstanceData?.isLogsEnabled,
    resourceInstanceData?.active,
    isResourceBYOA,
    isCliManagedResource,
    resourceType,
    resourceInstanceData?.backupStatus?.backupPeriodInHours
  );

  let pageTitle = "Resource";

  if (tabs[view]) {
    pageTitle = tabs[view];
  }

  let cloudProvider = resourceInstanceData?.cloudProvider;
  //The api doesn't return cloud provider field in the root object for a Cloud Provider Account instance
  //Get the cloud provider data from result parameters in this case
  if (!cloudProvider) {
    if (resourceInstanceData?.resultParameters?.cloud_provider) {
      cloudProvider = resourceInstanceData?.resultParameters?.cloud_provider;
    }
  }

  const cloudProviderAccountInstanceURL = useMemo(() => {
    let resourceId = null;
    let instanceURL = null;
    if (serviceOffering) {
      const cloudProviderResource = serviceOffering.resourceParameters?.find(
        (resource) => resource?.resourceId.startsWith("r-injectedaccountconfig")
      );
      if (cloudProviderResource) resourceId = cloudProviderResource.resourceId;
    }

    if (
      resourceId &&
      resourceInstanceData?.resultParameters?.cloud_provider_account_config_id
    ) {
      instanceURL = getResourceInstancesDetailsRoute(
        serviceId,
        environmentId,
        productTierId,
        resourceId,
        resourceInstanceData?.resultParameters
          ?.cloud_provider_account_config_id,
        subscriptionData?.id
      );
    }
    return instanceURL;
  }, [
    serviceOffering,
    resourceInstanceData,
    serviceId,
    environmentId,
    productTierId,
    subscriptionData?.id,
  ]);

  useEffect(() => {
    if (router.isReady) {
      if (view in tabs) {
        setCurrentTab(tabs[view]);
      }
    }
  }, [router.isReady, view, tabs]);

  const queryData = {
    serviceProviderId: serviceOffering?.serviceProviderId,
    serviceKey: serviceOffering?.serviceURLKey,
    serviceAPIVersion: serviceOffering?.serviceAPIVersion,
    serviceEnvironmentKey: serviceOffering?.serviceEnvironmentURLKey,
    serviceModelKey: serviceOffering?.serviceModelURLKey,
    productTierKey: serviceOffering?.productTierURLKey,
    subscriptionId: subscriptionData?.id,
    resourceInstanceId: resourceInstanceId,
    resourceKey: resourceKey,
  };

  const isCustomNetworkEnabled = useMemo(() => {
    let enabled = false;

    if (
      serviceOffering?.serviceModelFeatures?.find((featureObj) => {
        return featureObj.feature === "CUSTOM_NETWORKS";
      })
    )
      enabled = true;

    return enabled;
  }, [serviceOffering]);

  if (isLoading || isLoadingSubscription || !resourceInstanceData) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        customLogo
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.instancesList}
      >
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!isLoadingSubscription && !subscriptionData?.id) {
    return (
      <DashboardLayout
        setSupportDrawerOpen={setSupportDrawerOpen}
        setCurrentTabValue={setCurrentTabValue}
        isNotShow
        marketplacePage={currentSource === "access" ? false : true}
        accessPage
        currentSubscription={subscriptionData}
        SidebarUI={
          <MarketplaceServiceSidebar
            serviceId={serviceId}
            environmentId={environmentId}
            resourceParameters={serviceOffering?.resourceParameters}
            isLoading={isServiceOfferingLoading}
            serviceName={serviceOffering?.serviceName}
            productTierId={productTierId}
            currentSubscription={subscriptionData}
            isCustomNetworkEnabled={isCustomNetworkEnabled}
          />
        }
        serviceName={serviceOffering?.serviceName}
        customLogo
        serviceLogoURL={serviceOffering?.serviceLogoURL}
        pageType={sidebarActiveOptions.instancesList}
      >
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <SubscriptionNotFoundUI />
      </DashboardLayout>
    );
  }

  const servicePlanUrlLink = getMarketplaceRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource
  );

  const serviceAPIDocsLink = getAPIDocsRoute(
    serviceId,
    environmentId,
    productTierId,
    currentSource,
    subscriptionData?.id
  );

  return (
    <DashboardLayout
      setSupportDrawerOpen={setSupportDrawerOpen}
      setCurrentTabValue={setCurrentTabValue}
      marketplacePage={currentSource === "access" ? false : true}
      accessPage
      currentSubscription={subscriptionData}
      enableConsumptionLinks
      servicePlanUrlLink={servicePlanUrlLink}
      apiDocsurl={serviceAPIDocsLink}
      serviceId={serviceId}
      serviceApiId={serviceOffering?.serviceAPIID}
      isNotShow
      SidebarUI={
        <MarketplaceServiceSidebar
          serviceId={serviceId}
          environmentId={environmentId}
          resourceParameters={serviceOffering?.resourceParameters}
          isLoading={isServiceOfferingLoading}
          serviceName={serviceOffering?.serviceName}
          activeResourceId={resourceId}
          productTierId={productTierId}
          currentSource={currentSource}
          currentSubscription={subscriptionData}
          isCustomNetworkEnabled={isCustomNetworkEnabled}
        />
      }
      serviceName={serviceOffering?.serviceName}
      customLogo
      serviceLogoURL={serviceOffering?.serviceLogoURL}
      pageType={sidebarActiveOptions.instancesList}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link href={resourceInstancesUrl}>
          <Button
            startIcon={<RiArrowGoBackFill />}
            sx={{
              color: `${styleConfig.secondaryColor} !important`,
              "&:hover": {
                background: styleConfig.secondaryHoverLight,
              },
            }}
          >
            Back to list of Resource Instances
          </Button>
        </Link>
        <Button
          startIcon={
            insightsVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          }
          sx={{
            color: `${styleConfig.secondaryColor} !important`,
            "&:hover": {
              background: styleConfig.secondaryHoverLight,
            },
          }}
          onClick={() => dispatch(toggleInstanceDetailsSummaryVisibility())}
        >
          {insightsVisible ? "Hide Insights" : "View Insights"}{" "}
        </Button>
      </Stack>
      <Collapse in={insightsVisible}>
        <ResourceInstanceOverview
          resourceInstanceId={resourceInstanceId}
          region={resourceInstanceData?.region}
          cloudProvider={cloudProvider}
          status={resourceInstanceData?.status}
          createdAt={resourceInstanceData?.createdAt}
          modifiedAt={resourceInstanceData?.modifiedAt}
          networkType={resourceInstanceData?.networkType}
          healthStatusPercent={resourceInstanceData?.healthStatusPercent}
          isResourceBYOA={isResourceBYOA}
          isCliManagedResource={isCliManagedResource}
          subscriptionOwner={subscriptionData?.subscriptionOwnerName}
        />
      </Collapse>
      <Tabs
        value={currentTab}
        sx={{ marginTop: insightsVisible ? "10px" : "24px" }}
      >
        {Object.entries(tabs).map(([key, value]) => {
          return (
            <Tab
              key={key}
              label={getTabLabel(value, isResourceBYOA)}
              value={value}
              onClick={() => {
                router.push(
                  getResourceInstancesDetailswithKeyRoute(
                    serviceId,
                    environmentId,
                    productTierId,
                    resourceId,
                    resourceInstanceId,
                    key,
                    subscriptionData?.id
                  )
                );
              }}
              sx={{ padding: "4px !important", marginRight: "16px" }}
            />
          );
        })}
      </Tabs>
      {currentTab === tabs.resourceInstanceDetails && (
        <ResourceInstanceDetails
          resourceInstanceId={resourceInstanceId}
          createdAt={resourceInstanceData?.createdAt}
          modifiedAt={resourceInstanceData?.modifiedAt}
          resultParameters={resourceInstanceData.resultParameters}
          isLoading={
            resourceSchemaQuery.isLoading || resourceInstanceQuery.isLoading
          }
          resultParametersSchema={
            resourceSchemaQuery?.data?.DESCRIBE?.outputParameters
          }
          serviceOffering={serviceOffering}
          subscriptionId={subscriptionId}
          customNetworkDetails={resourceInstanceData.customNetworkDetails}
          cloudProviderAccountInstanceURL={cloudProviderAccountInstanceURL}
          resourceInstanceData={resourceInstanceData}
          autoscalingEnabled={resourceInstanceData?.autoscalingEnabled}
          highAvailability={resourceInstanceData?.highAvailability}
          backupStatus={resourceInstanceData?.backupStatus}
          autoscaling={resourceInstanceData?.autoscaling}
          serverlessEnabled={resourceInstanceData?.serverlessEnabled}
        />
      )}
      {currentTab === tabs.connectivity && (
        <Connectivity
          networkType={resourceInstanceData.connectivity.networkType}
          clusterEndpoint={resourceInstanceData.connectivity.clusterEndpoint}
          nodeEndpoints={resourceInstanceData.connectivity.nodeEndpoints}
          ports={resourceInstanceData.connectivity.ports}
          availabilityZones={
            resourceInstanceData.connectivity.availabilityZones
          }
          publiclyAccessible={
            resourceInstanceData.connectivity.publiclyAccessible
          }
          privateNetworkCIDR={
            resourceInstanceData.connectivity.privateNetworkCIDR
          }
          privateNetworkId={resourceInstanceData.connectivity.privateNetworkId}
          globalEndpoints={resourceInstanceData.connectivity.globalEndpoints}
          nodes={resourceInstanceData.nodes}
          queryData={queryData}
          refetchInstance={resourceInstanceQuery.refetch}
          additionalEndpoints={
            resourceInstanceData.connectivity.additionalEndpoints
          }
        />
      )}
      {currentTab === tabs.nodes && (
        <NodesTable
          isAccessSide={true}
          resourceName={resourceName}
          nodes={resourceInstanceData.nodes}
          refetchData={resourceInstanceQuery.refetch}
          isRefetching={resourceInstanceQuery.isRefetching}
          serviceOffering={serviceOffering}
          resourceKey={resourceKey}
          resourceInstanceId={resourceInstanceId}
          subscriptionData={subscriptionData}
          subscriptionId={subscriptionData?.id}
        />
      )}
      {currentTab === tabs.metrics && (
        <Metrics
          resourceInstanceId={resourceInstanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.metricsSocketURL}
          instanceStatus={resourceInstanceData?.status}
          resourceKey={resourceInstanceData?.resourceKey}
          customMetrics={resourceInstanceData?.customMetrics || []}
          mainResourceHasCompute={resourceInstanceData?.mainResourceHasCompute}
          productTierType={serviceOffering?.productTierType}
        />
      )}
      {currentTab === tabs.logs && (
        <Logs
          resourceInstanceId={resourceInstanceId}
          nodes={resourceInstanceData.nodes}
          socketBaseURL={resourceInstanceData.logsSocketURL}
          instanceStatus={resourceInstanceData?.status}
          resourceKey={resourceInstanceData?.resourceKey}
          mainResourceHasCompute={resourceInstanceData?.mainResourceHasCompute}
        />
      )}

      {currentTab === tabs.auditLogs && (
        <AuditLogs
          instanceId={resourceInstanceId}
          subscriptionId={subscriptionId}
          serviceId={serviceId}
          environmentId={environmentId}
          productTierId={productTierId}
        />
      )}
      {currentTab === tabs.backups && (
        <Backup
          backupStatus={resourceInstanceData?.backupStatus}
          instanceId={resourceInstanceId}
          accessQueryParams={queryData}
          resourceName={resourceName}
          networkType={
            resourceInstanceData?.connectivity?.networkType
              ? resourceInstanceData?.connectivity?.networkType.toUpperCase()
              : "PUBLIC"
          }
        />
      )}
      <SideDrawerRight
        size="xlarge"
        open={supportDrawerOpen}
        closeDrawer={closeSupportDrawer}
        RenderUI={
          <AccessSupport
            service={serviceOffering}
            currentTabValue={currentTabValue}
          />
        }
      />
    </DashboardLayout>
  );
}

export default ResourceInstance;

function getTabs(
  isMetricsEnabled,
  isLogsEnabled,
  isActive,
  isResourceBYOA,
  isCliManagedResource,
  resourceType,
  isBackup
) {
  const tabs = {
    resourceInstanceDetails: "Resource Instance Details",
    connectivity: "Connectivity",
    nodes: "Nodes",
  };
  if (isMetricsEnabled && !isResourceBYOA && !isCliManagedResource)
    tabs["metrics"] = "Metrics";
  if (isLogsEnabled && !isResourceBYOA) tabs["logs"] = "Logs";

  if (!isActive || resourceType === RESOURCE_TYPES.Terraform) {
    delete tabs.connectivity;
    delete tabs.nodes;
  }

  tabs["auditLogs"] = "Events";
  if (isBackup) {
    tabs["backups"] = "Backups";
  }

  return tabs;
}

function getTabLabel(value, isResourceBYOA) {
  if (value === "Resource Instance Details" && isResourceBYOA) {
    return "Account Instance Details";
  }
  return value;
}
