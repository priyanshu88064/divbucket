import type { TreeState } from "@core/types/document";

export type EditorPlacement = "inside" | "before" | "after";

export interface EditorOperationTarget {
  referenceNodeId: number;
  placement: EditorPlacement;
}

type DocumentKeys =
  | "pageIds"
  | "nodeChildrenMap"
  | "nodeRecordMap"
  | "nodeStyleMap";

type SessionKeys = Exclude<keyof TreeState, DocumentKeys>;

export type DocumentStatePatch = Partial<Pick<TreeState, DocumentKeys>>;
export type SessionStatePatch = Partial<Pick<TreeState, SessionKeys>>;

export interface EditorOperationResult<TValue = undefined> {
  document?: DocumentStatePatch;
  session?: SessionStatePatch;
  value?: TValue;
  error?: string;
}
