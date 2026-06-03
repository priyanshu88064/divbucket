import { createElement } from "react";
import { FiStar } from "react-icons/fi";
import type { PaletteLauncherDefinition } from "@core/kernel/types";
import IconPicker from "./IconPicker";

export const iconPaletteLauncherDefinition: PaletteLauncherDefinition = {
  id: "core.palette.icons",
  label: "Icons",
  group: "Elements",
  order: 999,
  trigger: "hover",
  surface: "popover",
  placement: "right-center",
  offset: 12,
  searchTokens: ["icon", "icons", "svg", "symbol"],
  icon: () => createElement(FiStar, { size: 24 }),
  renderPanel: ({ open, close }) => <IconPicker open={open} onClose={close} />,
};
