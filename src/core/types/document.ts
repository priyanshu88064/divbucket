import type { CSSProperties } from "react";

export const DOCUMENT_VERSION = 2 as const;
export type DocumentVersion = typeof DOCUMENT_VERSION;

export type BackgroundType = "Auto" | "Solid" | "URL" | "Custom";
export type CssState = "default" | "hover" | "active";

export type CoreNodeKind =
  | "core:root"
  | "core:container"
  | "core:row"
  | "core:heading"
  | "core:text"
  | "core:paragraph"
  | "core:image"
  | "core:video"
  | "core:button"
  | "core:list"
  | "core:listItem";

export type CustomNodeKind = `custom:${string}`;
export type NodeKind = CoreNodeKind | CustomNodeKind;

export type CoreContainerNodeKind =
  | "core:root"
  | "core:container"
  | "core:row"
  | "core:list";
export type CoreContentNodeKind =
  | "core:heading"
  | "core:text"
  | "core:paragraph"
  | "core:button"
  | "core:listItem";
export type CoreMediaNodeKind = "core:image" | "core:video";

export const CORE_NODE_KINDS: CoreNodeKind[] = [
  "core:root",
  "core:container",
  "core:row",
  "core:heading",
  "core:text",
  "core:paragraph",
  "core:image",
  "core:video",
  "core:button",
  "core:list",
  "core:listItem",
];

export const CORE_CONTAINER_NODE_KINDS: CoreContainerNodeKind[] = [
  "core:root",
  "core:container",
  "core:row",
  "core:list",
];
export const CORE_CONTENT_NODE_KINDS: CoreContentNodeKind[] = [
  "core:heading",
  "core:text",
  "core:paragraph",
  "core:button",
  "core:listItem",
];
export const CORE_MEDIA_NODE_KINDS: CoreMediaNodeKind[] = [
  "core:image",
  "core:video",
];

export const isCoreNodeKind = (kind: NodeKind): kind is CoreNodeKind =>
  CORE_NODE_KINDS.includes(kind as CoreNodeKind);

export const isCustomNodeKind = (kind: NodeKind): kind is CustomNodeKind =>
  kind.startsWith("custom:");

export const isCoreContainerNodeKind = (
  kind: NodeKind,
): kind is CoreContainerNodeKind =>
  CORE_CONTAINER_NODE_KINDS.includes(kind as CoreContainerNodeKind);

export const isCoreContentNodeKind = (
  kind: NodeKind,
): kind is CoreContentNodeKind =>
  CORE_CONTENT_NODE_KINDS.includes(kind as CoreContentNodeKind);

export const isCoreMediaNodeKind = (
  kind: NodeKind,
): kind is CoreMediaNodeKind =>
  CORE_MEDIA_NODE_KINDS.includes(kind as CoreMediaNodeKind);

export type CorePresetId =
  | "core:page"
  | "core:container"
  | "core:row"
  | "core:heading"
  | "core:text"
  | "core:paragraph"
  | "core:image"
  | "core:video"
  | "core:button"
  | "core:list"
  | "core:listItem"
  | "core:navbar"
  | "core:hero"
  | "core:feature"
  | "core:card";

export type CustomPresetId = `custom:${string}`;
export type PresetId = CorePresetId | CustomPresetId;

export type SpacingLinkMode = "none" | "x" | "y" | "all";

export interface LegacyJoints {
  x?: boolean;
  y?: boolean;
  all?: boolean;
}

export interface LegacyNodeCssData {
  backgroundType?: BackgroundType;
  joints?: {
    margin?: LegacyJoints;
    padding?: LegacyJoints;
  };
}

export interface NodeStyleUi {
  background?: {
    mode?: BackgroundType;
  };
  spacing?: {
    margin?: { linkMode?: SpacingLinkMode };
    padding?: { linkMode?: SpacingLinkMode };
  };
}

interface NodeRecordBase<TKind extends NodeKind> {
  name: string;
  type: TKind;
  hyperlink?: string;
  styleUi?: NodeStyleUi;
}

export type CoreRootNodeRecord = NodeRecordBase<"core:root">;

export type CoreContainerNodeRecord =
  | NodeRecordBase<"core:container">
  | NodeRecordBase<"core:row">
  | NodeRecordBase<"core:list">;

export type CoreContentNodeRecord =
  | (NodeRecordBase<"core:heading"> & { content: string })
  | (NodeRecordBase<"core:text"> & { content: string })
  | (NodeRecordBase<"core:paragraph"> & { content: string })
  | (NodeRecordBase<"core:button"> & { content: string })
  | (NodeRecordBase<"core:listItem"> & { content: string });

export type CoreImageNodeRecord = NodeRecordBase<"core:image"> & {
  media: {
    src: string;
    alt?: string;
  };
};

export type CoreVideoNodeRecord = NodeRecordBase<"core:video"> & {
  media: {
    src: string;
    autoPlay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
};

export type CoreMediaNodeRecord = CoreImageNodeRecord | CoreVideoNodeRecord;

export type CoreNodeRecord =
  | CoreRootNodeRecord
  | CoreContainerNodeRecord
  | CoreContentNodeRecord
  | CoreMediaNodeRecord;

export type CustomNodeRecord = NodeRecordBase<CustomNodeKind> & {
  payload?: Record<string, unknown>;
};

export type NodeRecord = CoreNodeRecord | CustomNodeRecord;

export type NodeChildrenMap = Record<number, number[]>;
export type NodeRecordMap = Record<number, NodeRecord>;
export type NodeStyleMap = Record<
  number,
  {
    default: CSSProperties;
    hover: CSSProperties;
    active: CSSProperties;
  }
>;

export interface Document {
  version: DocumentVersion;
  pageIds: number[];
  nodeChildrenMap: NodeChildrenMap;
  nodeRecordMap: NodeRecordMap;
  nodeStyleMap: NodeStyleMap;
  metadata?: {
    title?: string;
  };
}

export interface LegacyNodeRecord {
  name?: string;
  type?: string;
  hyperlink?: string;
  content?: string | null;
  unit?: boolean;
  isLeaf?: boolean;
  open?: boolean;
  isOpen?: boolean;
  media?: {
    src?: string;
    alt?: string;
    autoPlay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    newTab?: boolean;
  };
  cssData?: LegacyNodeCssData;
  styleUi?: NodeStyleUi;
}

export interface LegacyDocument {
  tree: Record<number, number[]>;
  dataMap: Record<number, LegacyNodeRecord>;
  styleMap: Record<
    number,
    {
      default?: CSSProperties;
      hover?: CSSProperties;
      active?: CSSProperties;
    }
  >;
}

export interface BGContentRect {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface Clipboard {
  cut: number | null;
  copy: number | null;
}

export interface EditorSessionState {
  activeNodeId: number | null;
  hoverNodeId: number | null;
  activePageId: number | null;
  bgContentRect: BGContentRect;
  clipboard: Clipboard;
  cssState: CssState;
  pageOpenMap: Record<number, boolean>;
}

export interface TreeState extends EditorSessionState {
  pageIds: number[];
  nodeChildrenMap: NodeChildrenMap;
  nodeRecordMap: NodeRecordMap;
  nodeStyleMap: NodeStyleMap;
}

export const isContentNodeRecord = (
  record: NodeRecord,
): record is CoreContentNodeRecord => "content" in record;
