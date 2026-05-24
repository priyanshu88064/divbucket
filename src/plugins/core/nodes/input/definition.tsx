import { createElement } from "react";
import { LuFolderInput } from "react-icons/lu";
import type { NodeTypeDefinition } from "@core/kernel/types";
import type { NodeRecord } from "@core/types/document";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { INPUT_EDIT_PANEL_ID } from "../../edit-panels/input/definition";
import { renderInputNode } from "../shared/renderers";
import {
  DEFAULT_INPUT_PAYLOAD,
  coerceInputPayload,
} from "./payload";

export const inputNodeDefinition: NodeTypeDefinition = {
  kind: "custom:input",
  label: "Input",
  icon: () => createElement(LuFolderInput, { size: 24 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 10 },
  renderer: renderInputNode,
  createRecord: () =>
    ({
      name: "Input",
      type: "custom:input",
      payload: { ...DEFAULT_INPUT_PAYLOAD },
    }) as NodeRecord,
  createStyle: () => ({
    width: "100%",
    maxWidth: "320px",
    height: "40px",
    paddingLeft: "12px",
    paddingRight: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#cbd5e1",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
  }),
  edit: { panelId: INPUT_EDIT_PANEL_ID },
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: {
    tag: "input",
    selfClosing: true,
    getAttributes: (record) => {
      if (record.type !== "custom:input") return {};
      const payload = coerceInputPayload(record);
      return {
        type: payload.inputType,
        placeholder: payload.placeholder,
        value: payload.value,
        name: payload.name,
        required: payload.required,
        disabled: payload.disabled,
      };
    },
  },
};
