import type { NodeKind } from "@core/types/document";
import type { EditorPlugin, NodeTypeDefinition } from "@core/kernel/types";
import { buttonNodeDefinition } from "./button/definition";
import { containerNodeDefinition } from "./container/definition";
import { headingNodeDefinition } from "./heading/definition";
import { imageNodeDefinition } from "./image/definition";
import { listItemNodeDefinition } from "./listItem/definition";
import { listNodeDefinition } from "./list/definition";
import { paragraphNodeDefinition } from "./paragraph/definition";
import { rootNodeDefinition } from "./root/definition";
import { rowNodeDefinition } from "./row/definition";
import { textNodeDefinition } from "./text/definition";
import { videoNodeDefinition } from "./video/definition";

export const CORE_NODE_DEFINITIONS: NodeTypeDefinition[] = [
  rootNodeDefinition,
  containerNodeDefinition,
  rowNodeDefinition,
  headingNodeDefinition,
  textNodeDefinition,
  paragraphNodeDefinition,
  buttonNodeDefinition,
  imageNodeDefinition,
  videoNodeDefinition,
  listNodeDefinition,
  listItemNodeDefinition,
];

const CORE_NODE_DEFINITION_MAP = new Map<NodeKind, NodeTypeDefinition>(
  CORE_NODE_DEFINITIONS.map((definition) => [definition.kind, definition]),
);

export const CORE_RUNTIME_NODE_KINDS: NodeKind[] =
  CORE_NODE_DEFINITIONS.map((definition) => definition.kind);

export const getCoreNodeDefinition = (kind: NodeKind) =>
  CORE_NODE_DEFINITION_MAP.get(kind);

export const coreNodesPlugin: EditorPlugin = {
  id: "core.nodes",
  register: (api) => {
    CORE_NODE_DEFINITIONS.forEach((definition) => {
      api.registerNodeType(definition);
    });
  },
};
