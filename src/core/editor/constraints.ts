import { editorRegistry } from "@core/kernel/bootstrap";
import type { EditorRegistry } from "@core/kernel/types";
import type { NodeKind, TreeState } from "@core/types/document";
import type { EditorOperationTarget } from "./types";
import { getParentNodeId, ROOT_COLLECTION_ID } from "./treeRelations";

export interface InsertLocation {
  parentId: number;
  index: number;
}

type ConstraintState = Pick<TreeState, "nodeChildrenMap" | "nodeRecordMap">;

const getRegistry = (registry?: EditorRegistry) => registry || editorRegistry;

export const isNodeKindContainer = (
  kind: NodeKind,
  registry?: EditorRegistry,
) => getRegistry(registry).getNodeType(kind)?.isContainer || false;

export const canParentAcceptChildKind = ({
  parentKind,
  childKind,
  registry,
}: {
  parentKind: NodeKind;
  childKind: NodeKind;
  registry?: EditorRegistry;
}) => {
  const definition = getRegistry(registry).getNodeType(parentKind);
  if (!definition?.isContainer) return false;
  if (definition.acceptsChild) {
    return definition.acceptsChild(childKind);
  }
  return childKind !== "core:root";
};

export const resolveInsertLocation = (
  state: ConstraintState,
  target: EditorOperationTarget,
): InsertLocation | null => {
  const { referenceNodeId, placement } = target;

  if (placement === "inside") {
    const children = state.nodeChildrenMap[referenceNodeId] || [];
    return { parentId: referenceNodeId, index: children.length };
  }

  const parentId = getParentNodeId(
    state.nodeChildrenMap,
    ROOT_COLLECTION_ID,
    referenceNodeId,
  );
  if (parentId === null) {
    return null;
  }

  const siblings = state.nodeChildrenMap[parentId] || [];
  const refIndex = siblings.indexOf(referenceNodeId);
  if (refIndex < 0) {
    return null;
  }

  return {
    parentId,
    index: placement === "before" ? refIndex : refIndex + 1,
  };
};

export const canInsertChildKindAtParent = ({
  state,
  parentId,
  childKind,
  registry,
}: {
  state: ConstraintState;
  parentId: number;
  childKind: NodeKind;
  registry?: EditorRegistry;
}) => {
  if (parentId === ROOT_COLLECTION_ID) {
    return childKind === "core:root";
  }

  if (childKind === "core:root") {
    return false;
  }

  const parentRecord = state.nodeRecordMap[parentId];
  if (!parentRecord) {
    return false;
  }

  return canParentAcceptChildKind({
    parentKind: parentRecord.type,
    childKind,
    registry,
  });
};

export const canPlaceChildKindAtTarget = ({
  state,
  childKind,
  target,
  registry,
}: {
  state: ConstraintState;
  childKind: NodeKind;
  target: EditorOperationTarget;
  registry?: EditorRegistry;
}) => {
  const location = resolveInsertLocation(state, target);
  if (!location) {
    return false;
  }

  return canInsertChildKindAtParent({
    state,
    parentId: location.parentId,
    childKind,
    registry,
  });
};
