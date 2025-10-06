import type { CSSProperties } from "react";

export type BackgroundType = "Auto" | "Solid" | "URL" | "Custom";
export type CssState = "default" | "hover" | "active";

export interface Tree {
  [id: number]: number[];
}

export interface Joints {
  x?: boolean;
  y?: boolean;
  all?: boolean;
}

export interface NodeStyle {
  [id: number]: {
    default: CSSProperties;
    hover: CSSProperties;
    active: CSSProperties;
  };
}

export interface NodeData {
  [id: number]: {
    name: string;
    type: string;
    hyperlink?: string;
    newTab?: boolean;
    src?: string;
    alt?: string;
    content?: string | null;
    unit?: boolean;
    open?: boolean;
    cssData?: {
      backgroundType?: BackgroundType;
      joints?: {
        margin?: Joints;
        padding?: Joints;
      };
    };
  };
}

export interface BGContentRect {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Clipboard {
  cut: number | null;
  copy: number | null;
}

export interface TreeState {
  tree: Tree;
  dataMap: NodeData;
  styleMap: NodeStyle;
  activeNodeId: number | null;
  activeTab: number | null;
  bgContentRect: BGContentRect;
  clipboard: Clipboard;
  cssState: CssState;
}
