import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "../shared/templateHelpers";

export const createNavbarPresetTemplate = ({
  createRecord,
  createStyle,
}: PresetTemplateHelpers): Template => {
  const rowStyleBucket = {
    default: createStyle("core:row"),
    hover: {},
    active: {},
  };
  const imageStyleBucket = {
    default: createStyle("core:image"),
    hover: {},
    active: {},
  };
  const textStyleBucket = {
    default: createStyle("core:text"),
    hover: {},
    active: {},
  };

  return {
    nodeChildrenMap: {
      0: [1, 2],
      1: [],
      2: [3, 4, 5, 6],
      3: [],
      4: [],
      5: [],
      6: [],
    },
    nodeStyleMap: {
      0: {
        default: {
          ...rowStyleBucket,
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
          gap: "20px",
          justifyContent: "space-between",
          borderStyle: "Solid",
          borderColor: "gray",
          borderRadius: "5px",
          borderWidth: "1px",
          alignItems: "center",
        },
        hover: {},
        active: {},
      },
      1: imageStyleBucket,
      2: {
        default: {
          ...rowStyleBucket.default,
          gap: "50px",
          minHeight: "0",
        },
        hover: {},
        active: {},
      },
      3: {
        default: {
          ...textStyleBucket.default,
          fontSize: "12px",
        },
        hover: {},
        active: {},
      },
      4: {
        default: {
          ...textStyleBucket.default,
          fontSize: "12px",
        },
        hover: {},
        active: {},
      },
      5: {
        default: {
          ...textStyleBucket.default,
          fontSize: "12px",
        },
        hover: {},
        active: {},
      },
      6: {
        default: {
          ...textStyleBucket.default,
          fontSize: "12px",
        },
        hover: {},
        active: {},
      },
    },
    nodeRecordMap: {
      0: {
        ...createRecord("core:row"),
        name: "Navbar",
      },
      1: {
        name: "core:image",
        type: "core:image",
        hyperlink: "",
        media: {
          src: "https://img.logoipsum.com/350.svg",
        },
      },
      2: {
        ...createRecord("core:row"),
      },
      3: {
        name: "core:text",
        type: "core:text",
        hyperlink: "",
        content: "Home",
      },
      4: {
        name: "core:text",
        type: "core:text",
        hyperlink: "",
        content: "Gallery",
      },
      5: {
        name: "core:text",
        type: "core:text",
        hyperlink: "",
        content: "About Us",
      },
      6: {
        name: "core:text",
        type: "core:text",
        hyperlink: "",
        content: "Contact Us",
      },
    },
  };
};
