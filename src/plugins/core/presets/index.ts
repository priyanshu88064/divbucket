import type { PresetId } from "@core/types/document";
import type { EditorPlugin, PresetDefinition } from "@core/kernel/types";
import { buttonPresetDefinition } from "./button/definition";
import { cardPresetDefinition } from "./card/definition";
import { containerPresetDefinition } from "./container/definition";
import { dividerPresetDefinition } from "./divider/definition";
import { expandedPresetDefinitions } from "./expandedCatalog";
import { featurePresetDefinition } from "./feature/definition";
import { headingPresetDefinition } from "./heading/definition";
import { heroPresetDefinition } from "./hero/definition";
import { imagePresetDefinition } from "./image/definition";
import { inputPresetDefinition } from "./input/definition";
import { listItemPresetDefinition } from "./listItem/definition";
import { listPresetDefinition } from "./list/definition";
import { navbarPresetDefinition } from "./navbar/definition";
import { pagePresetDefinition } from "./page/definition";
import { paragraphPresetDefinition } from "./paragraph/definition";
import { requestedPackPresetDefinitions } from "./requestedPack";
import { rowPresetDefinition } from "./row/definition";
import { textPresetDefinition } from "./text/definition";
import { videoPresetDefinition } from "./video/definition";

export const CORE_PRESET_DEFINITIONS: PresetDefinition[] = [
  pagePresetDefinition,
  containerPresetDefinition,
  rowPresetDefinition,
  headingPresetDefinition,
  textPresetDefinition,
  paragraphPresetDefinition,
  imagePresetDefinition,
  videoPresetDefinition,
  buttonPresetDefinition,
  inputPresetDefinition,
  dividerPresetDefinition,
  listPresetDefinition,
  listItemPresetDefinition,
  ...expandedPresetDefinitions,
  ...requestedPackPresetDefinitions,
  navbarPresetDefinition,
  heroPresetDefinition,
  featurePresetDefinition,
  cardPresetDefinition,
];

export const CORE_PRESET_IDS: PresetId[] = CORE_PRESET_DEFINITIONS.map(
  (definition) => definition.id,
);

export const corePresetsPlugin: EditorPlugin = {
  id: "core.presets",
  dependsOn: ["core.nodes"],
  register: (api) => {
    CORE_PRESET_DEFINITIONS.forEach((definition) => {
      api.registerPreset(definition);
    });
  },
};
