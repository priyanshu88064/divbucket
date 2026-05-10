import { createNodeIdAllocator } from "@core/editor/idAllocator";
import type {
  NodeRecord,
  NodeRecordMap,
  NodeStyleMap,
  PresetId,
  NodeKind,
} from "@core/types/document";
import type { PresetDefinition } from "@core/kernel/types";
import { PRESET_GROUPS } from "./groups";

interface SingleNodePresetOptions {
  id: PresetId;
  label: string;
  order: number;
  kind: NodeKind;
  recordOverride?: Partial<NodeRecord>;
  styleOverride?: NodeStyleMap[number]["default"];
}

export const createSingleNodePresetDefinition = ({
  id,
  label,
  order,
  kind,
  recordOverride,
  styleOverride,
}: SingleNodePresetOptions): PresetDefinition => ({
  id,
  label,
  group: PRESET_GROUPS.elements,
  order,
  requires: [kind],
  instantiate: ({ treeState, name, registry }) => {
    const nodeDefinition = registry.getNodeType(kind);
    if (!nodeDefinition) {
      throw new Error(
        `Unknown required node kind "${kind}" referenced by preset "${id}"`,
      );
    }

    const rootId = createNodeIdAllocator(treeState)();
    const defaultRecord = nodeDefinition.createRecord();
    const nodeRecordMap: NodeRecordMap = {
      [rootId]: {
        ...defaultRecord,
        ...(recordOverride || {}),
      } as NodeRecord,
    };

    if (name && name.length) {
      nodeRecordMap[rootId] = { ...nodeRecordMap[rootId], name };
    }

    return {
      rootId,
      nodeChildrenMap: { [rootId]: [] },
      nodeRecordMap,
      nodeStyleMap: {
        [rootId]: {
          default: {
            ...nodeDefinition.createStyle(),
            ...(styleOverride || {}),
          },
          hover: {},
          active: {},
        },
      },
    };
  },
});
