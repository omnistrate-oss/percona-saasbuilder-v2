import { EventType } from "src/types/event";
import { ColorObject } from "./index";

const stylesMap: Record<EventType, ColorObject & { label: string }> = {
  Customer: {
    color: "#0B4A8C",
    bgColor: "#127AE80A",
    borderColor: "#0B4A8C",
    label: "Customer",
  },
  Infra: {
    color: "#C11574",
    bgColor: "#FDF2FA",
    borderColor: "#FCCEEE",
    label: "Infra",
  },
  Maintenance: {
    color: "#026AA2",
    bgColor: "#F0F9FF",
    borderColor: "#B9E6FE",
    label: "Maintenance",
  },
};

export function getEventTypeStylesAndLabel(
  eventType: EventType
): ColorObject & { label: string } {
  let styles = stylesMap[eventType];

  if (!styles) {
    styles = { ...stylesMap["Infra"], label: eventType };
  }

  return styles;
}
