import type { StyleSectionDefinition } from "@core/kernel/types";
import { isMediaNode } from "../shared/visibility";

export const mediaFittingSection: StyleSectionDefinition = {
  id: "media-fitting",
  title: "Media fitting",
  visible: isMediaNode,
  fields: [
    {
      id: "object-fit",
      type: "text",
      label: "Object-Fit",
      prop: "objectFit",
      units: ["none", "cover", "contain", "fill"],
      selectOnly: true,
      defaultValue: "none",
    },
    {
      id: "object-position",
      type: "text",
      label: "Object-Position",
      prop: "objectPosition",
      units: [
        "center",
        "left",
        "left top",
        "left bottom",
        "top",
        "top left",
        "top right",
        "right",
        "right top",
        "right bottom",
        "bottom",
        "bottom left",
        "bottom right",
      ],
      selectOnly: true,
      defaultValue: "left top",
    },
  ],
};
