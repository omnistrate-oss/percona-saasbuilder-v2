export type CloudProvider = "aws" | "gcp" | "azure";

export type FormMode = "view" | "edit" | "create" | "delete";

export type ResourceType =
  | "OperatorCRD"
  | "Kustomize"
  | "HelmChart"
  | "Terraform"
  | "PortsBasedProxy";

// Network Types
export type NetworkType =
  | "PUBLIC"
  | "PRIVATE_VPC_PEERING"
  | "PRIVATE_LINK"
  | "INTERNAL";

export type InstanceStatus =
  | "FAILED"
  | "CANCELLED"
  | "PENDING_DEPENDENCY"
  | "PENDING"
  | "RUNNING"
  | "DEPLOYING"
  | "READY"
  | "SUCCESS"
  | "COMPLETE"
  | "STOPPED"
  | "DELETING"
  | "UNKNOWN";
