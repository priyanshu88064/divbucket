import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "../shared/templateHelpers";

export const createCardPresetTemplate = (_helpers: PresetTemplateHelpers): Template => ({
  nodeChildrenMap: {
    0: [1, 2, 3, 4],
    1: [],
    2: [],
    3: [],
    4: [],
  },
  nodeStyleMap: {
    1: {
      default: {
        backgroundColor: "#1163ff",
        borderRadius: "8px",
        translate: "0 -32px",
        boxShadow: "0 1px 3px #000000",
        height: "100px",
      },
      hover: {},
      active: {},
    },
    2: {
      default: {
        fontWeight: "bold",
        color: "#393939",
      },
      hover: {},
      active: {},
    },
    3: {
      default: {
        fontSize: "14px",
        marginTop: "8px",
        color: "#3d3d3d",
      },
      hover: {},
      active: {},
    },
    0: {
      default: {
        width: "255px",
        boxShadow: "0 1px 3px #000000",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "16px",
        paddingBottom: "16px",
        paddingRight: "16px",
      },
      hover: {},
      active: {},
    },
    4: {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#1163ff",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        marginTop: "32px",
      },
      hover: {},
      active: {},
    },
  },
  nodeRecordMap: {
    1: {
      name: "core:container",
      type: "core:container",
      styleUi: { background: { mode: "Solid" } },
    },
    2: {
      name: "core:text",
      type: "core:text",
      content: "Heading Card",
    },
    3: {
      name: "core:paragraph",
      type: "core:paragraph",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    },
    0: {
      name: "Card",
      type: "core:container",
    },
    4: {
      name: "core:button",
      type: "core:button",
      content: "Read More",
      styleUi: { background: { mode: "Solid" } },
    },
  },
});
