import { z } from "zod";
import {
  DOCUMENT_VERSION,
  type BackgroundType,
  type NodeKind,
} from "@core/types/document";

const zCssRecord = z.record(z.any());

const zStyleRecord = z.object({
  default: zCssRecord,
  hover: zCssRecord,
  active: zCssRecord,
});

const zLegacyStyleRecord = z.object({
  default: zCssRecord.optional(),
  hover: zCssRecord.optional(),
  active: zCssRecord.optional(),
});

const zBackgroundType = z.custom<BackgroundType>((value) =>
  ["Auto", "Solid", "URL", "Custom"].includes(String(value)),
);

const zCssData = z
  .object({
    backgroundType: zBackgroundType.optional(),
    joints: z
      .object({
        margin: z
          .object({
            x: z.boolean().optional(),
            y: z.boolean().optional(),
            all: z.boolean().optional(),
          })
          .optional(),
        padding: z
          .object({
            x: z.boolean().optional(),
            y: z.boolean().optional(),
            all: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional();

const zStyleUi = z
  .object({
    background: z
      .object({
        mode: zBackgroundType.optional(),
      })
      .optional(),
    spacing: z
      .object({
        margin: z
          .object({
            linkMode: z.enum(["none", "x", "y", "all"]).optional(),
          })
          .optional(),
        padding: z
          .object({
            linkMode: z.enum(["none", "x", "y", "all"]).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional();

const zBaseNode = z.object({
  name: z.string(),
  hyperlink: z.string().optional(),
  styleUi: zStyleUi,
});

const zCoreRootNode = zBaseNode.extend({
  type: z.literal("core:root"),
});

const zCoreContainerNode = zBaseNode.extend({
  type: z.union([
    z.literal("core:container"),
    z.literal("core:row"),
    z.literal("core:list"),
  ]),
});

const zCoreContentNode = zBaseNode.extend({
  type: z.union([
    z.literal("core:heading"),
    z.literal("core:text"),
    z.literal("core:paragraph"),
    z.literal("core:button"),
    z.literal("core:listItem"),
  ]),
  content: z.string(),
});

const zCoreImageNode = zBaseNode.extend({
  type: z.literal("core:image"),
  media: z.object({
    src: z.string(),
    alt: z.string().optional(),
  }),
});

const zCoreVideoNode = zBaseNode.extend({
  type: z.literal("core:video"),
  media: z.object({
    src: z.string(),
    autoPlay: z.boolean().optional(),
    controls: z.boolean().optional(),
    loop: z.boolean().optional(),
    muted: z.boolean().optional(),
  }),
});

const zCustomNode = zBaseNode
  .extend({
    type: z.string().regex(/^custom:/),
    payload: z.record(z.unknown()).optional(),
  })
  .passthrough();

const zV1RootNode = zBaseNode.extend({
  type: z.literal("root"),
});

const zV1ContainerNode = zBaseNode.extend({
  type: z.union([z.literal("container"), z.literal("row"), z.literal("list")]),
});

const zV1ContentNode = zBaseNode.extend({
  type: z.union([
    z.literal("heading"),
    z.literal("text"),
    z.literal("paragraph"),
    z.literal("button"),
    z.literal("listItem"),
  ]),
  content: z.string(),
});

const zV1ImageNode = zBaseNode.extend({
  type: z.literal("image"),
  media: z.object({
    src: z.string(),
    alt: z.string().optional(),
  }),
});

const zV1VideoNode = zBaseNode.extend({
  type: z.literal("video"),
  media: z.object({
    src: z.string(),
    autoPlay: z.boolean().optional(),
    controls: z.boolean().optional(),
    loop: z.boolean().optional(),
    muted: z.boolean().optional(),
  }),
});

export const zNodeKind = z.custom<NodeKind>((value) => {
  const raw = String(value);
  if (raw.startsWith("custom:")) return true;
  return [
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
  ].includes(raw);
});

export const zCanonicalNodeRecordV2 = z.union([
  zCoreRootNode,
  zCoreContainerNode,
  zCoreContentNode,
  zCoreImageNode,
  zCoreVideoNode,
  zCustomNode,
]);

export const zCanonicalNodeRecordV1 = z.union([
  zV1RootNode,
  zV1ContainerNode,
  zV1ContentNode,
  zV1ImageNode,
  zV1VideoNode,
]);

export const zCanonicalDocumentV2 = z.object({
  version: z.literal(DOCUMENT_VERSION),
  pageIds: z.array(z.number()),
  nodeChildrenMap: z.record(z.array(z.number())),
  nodeRecordMap: z.record(zCanonicalNodeRecordV2),
  nodeStyleMap: z.record(zStyleRecord),
  metadata: z.object({ title: z.string().optional() }).optional(),
});

export const zCanonicalDocumentV1 = z.object({
  version: z.literal(1),
  pageIds: z.array(z.number()),
  nodeChildrenMap: z.record(z.array(z.number())),
  nodeRecordMap: z.record(zCanonicalNodeRecordV1),
  nodeStyleMap: z.record(zStyleRecord),
  metadata: z.object({ title: z.string().optional() }).optional(),
});

export const zLegacyNodeRecord = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    hyperlink: z.string().optional(),
    content: z.union([z.string(), z.null()]).optional(),
    unit: z.boolean().optional(),
    isLeaf: z.boolean().optional(),
    open: z.boolean().optional(),
    isOpen: z.boolean().optional(),
    media: z
      .object({
        src: z.string().optional(),
        alt: z.string().optional(),
        autoPlay: z.boolean().optional(),
        controls: z.boolean().optional(),
        loop: z.boolean().optional(),
        muted: z.boolean().optional(),
        newTab: z.boolean().optional(),
      })
      .optional(),
    cssData: zCssData,
    styleUi: zStyleUi,
  })
  .passthrough();

export const zLegacyDocument = z.object({
  tree: z.record(z.array(z.number())),
  dataMap: z.record(zLegacyNodeRecord),
  styleMap: z.record(zLegacyStyleRecord),
});

export const zAnyDocumentInput = z.union([
  zCanonicalDocumentV2,
  zCanonicalDocumentV1,
  zLegacyDocument,
]);
