import type { CSSProperties } from "react";
import type {
  Clipboard,
  CssState,
  NodeChildrenMap,
  NodeRecord,
  NodeRecordMap,
  NodeStyleMap,
  TreeState,
} from "@core/types/document";
import {
  copyNode,
  cutNode,
  deleteFromParent,
  deleteNode,
  duplicateNode,
  insertNode,
  insertPreset,
  moveNode,
  pasteNode,
  revealParent,
  updateClipboardState,
  updateNodeRecord,
  updateNodeStyle,
} from "./operations";
import type { EditorOperationResult, EditorOperationTarget } from "./types";

export interface EditorService {
  insertNode: (
    state: TreeState,
    payload: { parent: number; child: number },
  ) => EditorOperationResult;
  insertPreset: (
    state: TreeState,
    payload: {
      nodeChildrenMap: NodeChildrenMap;
      nodeRecordMap: NodeRecordMap;
      nodeStyleMap: NodeStyleMap;
      rootId?: number;
    },
  ) => EditorOperationResult<number>;
  deleteNode: (
    state: TreeState,
    payload: { id: number },
  ) => EditorOperationResult;
  deleteFromParent: (
    state: TreeState,
    payload: { id: number | string },
  ) => EditorOperationResult;
  moveNode: (
    state: TreeState,
    payload: { node: number; target: EditorOperationTarget },
  ) => EditorOperationResult;
  cutNode: (state: TreeState) => EditorOperationResult;
  copyNode: (state: TreeState) => EditorOperationResult;
  pasteNode: (state: TreeState) => EditorOperationResult;
  duplicateNode: (state: TreeState) => EditorOperationResult;
  updateNodeRecord: (
    state: TreeState,
    payload: { id: number; data: NodeRecord },
  ) => EditorOperationResult;
  updateNodeStyle: (
    state: TreeState,
    payload: { id: number; style: CSSProperties; cssState: CssState },
  ) => EditorOperationResult;
  updateClipboard: (
    state: TreeState,
    payload: Clipboard,
  ) => EditorOperationResult;
  selectParent: (state: TreeState) => EditorOperationResult;
}

export const editorService: EditorService = {
  insertNode,
  insertPreset,
  deleteNode,
  deleteFromParent,
  moveNode,
  cutNode,
  copyNode,
  pasteNode,
  duplicateNode,
  updateNodeRecord,
  updateNodeStyle,
  updateClipboard: updateClipboardState,
  selectParent: revealParent,
};
