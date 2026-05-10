import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "../shared/templateHelpers";

export const createHeroPresetTemplate = (_helpers: PresetTemplateHelpers): Template => ({
  nodeChildrenMap: {
    3: [4, 5],
    4: [],
    2: [],
    1: [],
    0: [1, 2, 3],
    5: [],
  },
  nodeStyleMap: {
    3: {
      default: {
        gap: "48px",
        marginTop: "24px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      hover: {},
      active: {},
    },
    4: {
      default: {
        width: "fit-content",
        paddingTop: "8px",
        paddingRight: "16px",
        paddingLeft: "16px",
        paddingBottom: "8px",
        backgroundColor: "#8b3a00",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    2: {
      default: {
        fontSize: "14px",
        marginTop: "24px",
        textAlign: "justify",
        maxWidth: "800px",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      hover: {},
      active: {},
    },
    1: {
      default: {
        width: "fit-content",
        fontSize: "32px",
        fontWeight: "bolder",
      },
      hover: {},
      active: {},
    },
    0: {
      default: {
        height: "600px",
        backgroundImage: "url(https://picsum.photos/id/117/1920/1080)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      hover: {},
      active: {},
    },
    5: {
      default: {
        width: "fit-content",
        paddingTop: "8px",
        paddingRight: "16px",
        paddingLeft: "16px",
        paddingBottom: "8px",
        backgroundColor: "#8b3a00",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
  },
  nodeRecordMap: {
    3: {
      name: "core:row",
      type: "core:row",
    },
    4: {
      name: "core:button",
      type: "core:button",
      content: "Read more",
      styleUi: { background: { mode: "Solid" } },
    },
    2: {
      name: "core:paragraph",
      type: "core:paragraph",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    1: {
      name: "core:text",
      type: "core:text",
      content: "HERO SECTION",
    },
    0: {
      name: "core:container",
      type: "core:container",
      styleUi: { background: { mode: "URL" } },
    },
    5: {
      name: "core:button",
      type: "core:button",
      content: "This is hero section",
      styleUi: { background: { mode: "Solid" } },
    },
  },
});
