import type { NodeEditFieldKey, NodeEditDefinition } from "@core/kernel/types";
import { DEFAULT_EDIT_PANEL_ID } from "../../edit-panels";

export const defaultEdit = (fields: NodeEditFieldKey[]): NodeEditDefinition => ({
  panelId: DEFAULT_EDIT_PANEL_ID,
  fields,
});
