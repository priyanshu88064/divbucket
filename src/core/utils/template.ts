import { addTemplate } from "@core/state/reducers/treeReducer";
import type { AppDispatch } from "@core/state/store";
import type {
  NodeChildrenMap,
  NodeRecordMap,
  NodeStyleMap,
  PresetId,
  TreeState,
} from "@core/types/document";
import type { EditorRegistry } from "@core/kernel/types";

export interface InstantiatedTemplate {
  rootId: number;
  nodeChildrenMap: NodeChildrenMap;
  nodeRecordMap: NodeRecordMap;
  nodeStyleMap: NodeStyleMap;
}

export const instantiateTemplate = ({
  type,
  treeState,
  name,
  registry,
}: {
  type: PresetId | string;
  treeState: Pick<
    TreeState,
    "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
  >;
  name?: string;
  registry: EditorRegistry;
}): InstantiatedTemplate => {
  const preset = registry.getPreset(type as PresetId);
  if (!preset) {
    throw new Error(`Unknown preset kind: ${type}`);
  }

  return preset.instantiate({
    treeState,
    name,
    registry,
  });
};

export const createTemplate = ({
  type,
  dispatch,
  treeState,
  name,
  registry,
}: {
  type: PresetId | string;
  dispatch: AppDispatch;
  treeState: Pick<
    TreeState,
    "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
  >;
  name?: string;
  registry: EditorRegistry;
}) => {
  const { rootId, nodeChildrenMap, nodeRecordMap, nodeStyleMap } =
    instantiateTemplate({
      type,
      treeState,
      name,
      registry,
    });

  dispatch(addTemplate({ nodeChildrenMap, nodeRecordMap, nodeStyleMap }));
  return rootId;
};
