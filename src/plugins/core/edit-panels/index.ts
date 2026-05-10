import type { EditorPlugin } from "@core/kernel/types";
import {
  DEFAULT_EDIT_PANEL_ID,
  defaultEditPanelDefinition,
} from "./default/definition";

export { DEFAULT_EDIT_PANEL_ID };

export const coreEditPanelsPlugin: EditorPlugin = {
  id: "core.edit-panels",
  register: (api) => {
    api.registerEditPanel(defaultEditPanelDefinition);
  },
};
