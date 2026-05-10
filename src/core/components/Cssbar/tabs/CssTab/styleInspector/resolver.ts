import type {
  EditorRegistry,
  StyleSectionDefinition,
} from "@core/kernel/types";
import type { StyleInspectorContext } from "./types";

export const resolveStyleSectionsForNode = ({
  ctx,
  registry,
}: {
  ctx: StyleInspectorContext;
  registry: EditorRegistry;
}): StyleSectionDefinition[] => {
  const nodeDefinition = registry.getNodeType(ctx.node.type);
  if (!nodeDefinition) {
    throw new Error(`Missing node definition for kind: ${ctx.node.type}`);
  }

  return (nodeDefinition.styles?.sectionIds || [])
    .map((sectionId) => registry.getStyleSection(sectionId))
    .filter(
      (section): section is StyleSectionDefinition => section !== undefined,
    );
};
