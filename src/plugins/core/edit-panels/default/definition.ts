import EditTab from "@core/components/Cssbar/tabs/EditTab";
import type { EditPanelDefinition } from "@core/kernel/types";

export const DEFAULT_EDIT_PANEL_ID = "default";

export const defaultEditPanelDefinition: EditPanelDefinition = {
  id: DEFAULT_EDIT_PANEL_ID,
  component: EditTab,
};
