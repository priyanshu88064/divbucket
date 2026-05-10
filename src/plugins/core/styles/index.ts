import type { EditorPlugin, StyleSectionDefinition } from "@core/kernel/types";
import { appearanceSection } from "./appearance/definition";
import { borderSection } from "./border/definition";
import { cursorSection } from "./cursor/definition";
import { effectsSection } from "./effects/definition";
import { layoutSection } from "./layout/definition";
import { mediaFittingSection } from "./media-fitting/definition";
import { overflowSection } from "./overflow/definition";
import { positionSection } from "./position/definition";
import { spacingSection } from "./spacing/definition";
import { transformSection } from "./transform/definition";
import { transitionSection } from "./transition/definition";
import { typographySection } from "./typography/definition";

export const BASE_NON_ROOT_STYLE_SECTION_IDS = [
  "layout",
  "spacing",
  "appearance",
  "border",
  "position",
  "overflow",
  "effects",
  "transform",
  "transition",
  "cursor",
] as const;

export const TEXT_STYLE_SECTION_IDS = [
  ...BASE_NON_ROOT_STYLE_SECTION_IDS,
  "typography",
] as const;

export const MEDIA_STYLE_SECTION_IDS = [
  ...BASE_NON_ROOT_STYLE_SECTION_IDS,
  "media-fitting",
] as const;

export const CORE_STYLE_SECTIONS: StyleSectionDefinition[] = [
  layoutSection,
  spacingSection,
  appearanceSection,
  typographySection,
  borderSection,
  positionSection,
  overflowSection,
  effectsSection,
  transformSection,
  transitionSection,
  cursorSection,
  mediaFittingSection,
];

export const STYLE_SECTIONS = CORE_STYLE_SECTIONS;

export const coreStyleSectionsPlugin: EditorPlugin = {
  id: "core.style-sections",
  register: (api) => {
    CORE_STYLE_SECTIONS.forEach((section) => {
      api.registerStyleSection(section);
    });
  },
};
