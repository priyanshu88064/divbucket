import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "../shared/templateHelpers";

export const createPagePresetTemplate = (_helpers: PresetTemplateHelpers): Template => ({
  nodeChildrenMap: { 0: [] },
  nodeStyleMap: {
    0: {
      default: {
        width: "100%",
        height: "100%",
        minWidth: "350px",
        background: "white",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingBottom: "5px",
        paddingLeft: "5px",
      },
      hover: {},
      active: {},
    },
  },
  nodeRecordMap: {
    0: {
      type: "core:root",
      name: "newPage",
    },
  },
});
