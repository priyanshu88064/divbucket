import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "../shared/templateHelpers";

export const createListPresetTemplate = ({
  createRecord,
  createStyle,
}: PresetTemplateHelpers): Template => {
  const blockStyleBucket = {
    default: createStyle("core:container"),
    hover: {},
    active: {},
  };
  const listItemStyleBucket = {
    default: createStyle("core:text"),
    hover: {},
    active: {},
  };
  const blockRecord = createRecord("core:container");
  const listItemRecord = {
    ...createRecord("core:listItem"),
    name: "LItem",
    content: "• List Item",
  };

  return {
    nodeChildrenMap: { 0: [1, 2, 3, 4], 1: [], 2: [], 3: [], 4: [] },
    nodeStyleMap: {
      0: {
        default: {
          ...blockStyleBucket,
          height: "auto",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
        },
        hover: {},
        active: {},
      },
      1: listItemStyleBucket,
      2: listItemStyleBucket,
      3: listItemStyleBucket,
      4: listItemStyleBucket,
    },
    nodeRecordMap: {
      0: { ...blockRecord, name: "core:list" },
      1: listItemRecord,
      2: listItemRecord,
      3: listItemRecord,
      4: listItemRecord,
    },
  };
};
