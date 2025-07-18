import type { NodeData, NodeStyle, Tree } from "./Tree";

export interface Template {
  tree: Tree;
  styleMap: NodeStyle;
  dataMap: NodeData;
}

export interface TemplateGroup {
  [key: string]: Template;
}
