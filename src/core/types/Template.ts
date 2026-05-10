import type { NodeChildrenMap, NodeRecordMap, NodeStyleMap } from "./document";

export interface Template {
  nodeChildrenMap: NodeChildrenMap;
  nodeStyleMap: NodeStyleMap;
  nodeRecordMap: NodeRecordMap;
}

export interface TemplateGroup {
  [key: string]: Template;
}
