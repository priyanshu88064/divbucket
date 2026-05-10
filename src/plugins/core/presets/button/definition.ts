import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const buttonPresetDefinition = createSingleNodePresetDefinition({
  id: "core:button",
  label: "Button",
  order: 8,
  kind: "core:button",
  recordOverride: {
    styleUi: { background: { mode: "Solid" } },
  },
  styleOverride: {
    width: "fit-content",
    paddingTop: "4px",
    paddingRight: "8px",
    paddingLeft: "8px",
    paddingBottom: "4px",
    backgroundColor: "#1163ff",
    color: "#ffffff",
    borderRadius: "4px",
    cursor: "pointer",
  },
});
