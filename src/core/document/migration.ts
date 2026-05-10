import {
  DOCUMENT_VERSION,
  type CoreNodeKind,
  type Document,
  type LegacyDocument,
  type LegacyNodeCssData,
  type LegacyJoints,
  type NodeChildrenMap,
  type NodeRecord,
  type NodeRecordMap,
  type NodeStyleUi,
  type SpacingLinkMode,
  type NodeStyleMap,
  type NodeKind,
  isCoreNodeKind,
  isCoreContainerNodeKind,
  isCoreContentNodeKind,
  isCoreMediaNodeKind,
  isCustomNodeKind,
} from "@core/types/document";
import {
  zCanonicalDocumentV1,
  zCanonicalDocumentV2,
  zLegacyDocument,
} from "./schema";

const ROOT_PARENT_ID = -1;

const LEGACY_KIND_MAP: Record<string, CoreNodeKind> = {
  root: "core:root",
  Root: "core:root",
  "core:root": "core:root",
  container: "core:container",
  Container: "core:container",
  Block: "core:container",
  "core:container": "core:container",
  row: "core:row",
  Row: "core:row",
  "core:row": "core:row",
  heading: "core:heading",
  Heading: "core:heading",
  "core:heading": "core:heading",
  text: "core:text",
  Text: "core:text",
  "core:text": "core:text",
  paragraph: "core:paragraph",
  Paragraph: "core:paragraph",
  "core:paragraph": "core:paragraph",
  image: "core:image",
  Image: "core:image",
  "core:image": "core:image",
  video: "core:video",
  Video: "core:video",
  "core:video": "core:video",
  button: "core:button",
  Button: "core:button",
  "core:button": "core:button",
  list: "core:list",
  List: "core:list",
  "core:list": "core:list",
  listItem: "core:listItem",
  ListItem: "core:listItem",
  "core:listItem": "core:listItem",
};

const LEAF_KIND_SET = new Set<CoreNodeKind>([
  "core:heading",
  "core:text",
  "core:paragraph",
  "core:image",
  "core:video",
  "core:button",
  "core:listItem",
]);

const toNumberKeyedMap = <T>(raw: Record<string, T>): Record<number, T> =>
  Object.entries(raw).reduce(
    (acc, [key, value]) => {
      acc[Number(key)] = value;
      return acc;
    },
    {} as Record<number, T>,
  );

const normalizeChildrenMap = (
  legacyTree: LegacyDocument["tree"],
): NodeChildrenMap => {
  const nodeChildrenMap = toNumberKeyedMap(legacyTree);
  for (const [id, children] of Object.entries(nodeChildrenMap)) {
    nodeChildrenMap[Number(id)] = children.map((child) => Number(child));
  }

  if (!nodeChildrenMap[ROOT_PARENT_ID]) {
    throw new Error("Invalid tree: missing root collection at key -1");
  }

  return nodeChildrenMap;
};

const toNodeKind = (kind: unknown): NodeKind => {
  const raw = String(kind);
  if (raw.startsWith("custom:")) {
    return raw as NodeKind;
  }
  const resolved = LEGACY_KIND_MAP[raw];
  if (!resolved) {
    throw new Error(`Unknown node kind: ${raw}`);
  }
  return resolved;
};

const toSpacingLinkMode = (
  joints: LegacyJoints | undefined,
): SpacingLinkMode | undefined => {
  if (!joints) return undefined;
  if (joints.all) return "all";
  if (joints.x) return "x";
  if (joints.y) return "y";
  return undefined;
};

const styleUiFromCssData = (
  cssData?: LegacyNodeCssData,
): NodeStyleUi | undefined => {
  if (!cssData) return undefined;

  const backgroundMode = cssData.backgroundType;
  const marginLinkMode = toSpacingLinkMode(cssData.joints?.margin);
  const paddingLinkMode = toSpacingLinkMode(cssData.joints?.padding);

  const styleUi: NodeStyleUi = {};
  if (backgroundMode) {
    styleUi.background = { mode: backgroundMode };
  }

  if (marginLinkMode || paddingLinkMode) {
    styleUi.spacing = {};
    if (marginLinkMode) styleUi.spacing.margin = { linkMode: marginLinkMode };
    if (paddingLinkMode)
      styleUi.spacing.padding = { linkMode: paddingLinkMode };
  }

  if (Object.keys(styleUi).length === 0) {
    return undefined;
  }
  return styleUi;
};

const normalizeStyleUi = ({
  styleUi,
  cssData,
}: {
  styleUi?: NodeStyleUi;
  cssData?: LegacyNodeCssData;
}): NodeStyleUi | undefined => {
  if (styleUi) return styleUi;
  return styleUiFromCssData(cssData);
};

const toCanonicalNode = ({
  kind,
  raw,
}: {
  kind: NodeKind;
  raw: LegacyDocument["dataMap"][number];
}): NodeRecord => {
  const base = {
    name: raw.name || kind,
    type: kind,
    hyperlink: raw.hyperlink,
    styleUi: normalizeStyleUi({ styleUi: raw.styleUi, cssData: raw.cssData }),
  };

  if (kind === "core:image") {
    return {
      ...base,
      type: kind,
      media: {
        src: raw.media?.src || "",
        alt: raw.media?.alt,
      },
    };
  }

  if (kind === "core:video") {
    return {
      ...base,
      type: kind,
      media: {
        src: raw.media?.src || "",
        autoPlay: raw.media?.autoPlay,
        controls: raw.media?.controls,
        loop: raw.media?.loop,
        muted: raw.media?.muted,
      },
    };
  }

  if (isCoreContentNodeKind(kind)) {
    return {
      ...base,
      type: kind,
      content: raw.content ?? "",
    };
  }

  if (isCoreContainerNodeKind(kind)) {
    return {
      ...base,
      type: kind,
    };
  }

  if (isCustomNodeKind(kind)) {
    return {
      ...base,
      type: kind,
      payload: {},
    };
  }

  throw new Error(`Unsupported node kind: ${kind}`);
};

const toCanonicalNodeFromUnknown = (
  rawNode: Record<string, unknown>,
): NodeRecord => {
  const kind = toNodeKind(rawNode.type);
  const name =
    typeof rawNode.name === "string" && rawNode.name.length
      ? rawNode.name
      : kind;

  if (isCustomNodeKind(kind)) {
    return {
      name,
      type: kind,
      hyperlink:
        typeof rawNode.hyperlink === "string" ? rawNode.hyperlink : undefined,
      styleUi: normalizeStyleUi({
        styleUi: rawNode.styleUi as NodeStyleUi | undefined,
        cssData: rawNode.cssData as LegacyNodeCssData | undefined,
      }),
      payload: (rawNode.payload as Record<string, unknown> | undefined) || {},
    };
  }

  return toCanonicalNode({
    kind,
    raw: rawNode as LegacyDocument["dataMap"][number],
  });
};

const assertDocumentConsistency = (doc: Document): Document => {
  if (!doc.nodeChildrenMap[ROOT_PARENT_ID]) {
    throw new Error("Invalid tree: missing root collection at key -1");
  }

  for (const pageId of doc.pageIds) {
    const page = doc.nodeRecordMap[pageId];
    if (!page || page.type !== "core:root") {
      throw new Error(`Invalid page root: ${pageId}`);
    }
  }

  for (const [parentId, children] of Object.entries(doc.nodeChildrenMap)) {
    if (Number(parentId) === ROOT_PARENT_ID) continue;
    const parent = doc.nodeRecordMap[Number(parentId)];
    if (!parent) {
      throw new Error(`Invalid tree: missing parent node ${parentId}`);
    }
    if (
      isCoreNodeKind(parent.type) &&
      !isCoreContainerNodeKind(parent.type) &&
      children.length > 0
    ) {
      doc.nodeRecordMap[Number(parentId)] = {
        name: parent.name,
        type: "core:container",
        hyperlink: parent.hyperlink,
        styleUi: parent.styleUi,
      };
    }
    for (const childId of children) {
      if (!doc.nodeRecordMap[childId]) {
        throw new Error(
          `Invalid tree: orphan child ${childId} under parent ${parentId}`,
        );
      }
    }
  }

  for (const [id, node] of Object.entries(doc.nodeRecordMap)) {
    const numericId = Number(id);
    if (!doc.nodeStyleMap[numericId]) {
      throw new Error(`Missing style bucket for node ${id}`);
    }
    if (!doc.nodeChildrenMap[numericId]) {
      doc.nodeChildrenMap[numericId] = [];
    }
    if (isCustomNodeKind(node.type)) continue;
    if (isCoreContainerNodeKind(node.type)) continue;
    if (!isCoreContentNodeKind(node.type) && !isCoreMediaNodeKind(node.type)) {
      throw new Error(`Invalid node kind ${node.type}`);
    }
  }

  doc.nodeChildrenMap[ROOT_PARENT_ID] = [...doc.pageIds];
  return doc;
};

export const migrateLegacyDocument = (rawLegacy: unknown): Document => {
  const legacy = zLegacyDocument.parse(rawLegacy);
  const nodeChildrenMap = normalizeChildrenMap(legacy.tree);
  const pageIds = [...nodeChildrenMap[ROOT_PARENT_ID]];
  const nodeRecordMap: NodeRecordMap = {};
  const nodeStyleMap: NodeStyleMap = {};

  const knownIds = new Set<number>([
    ...Object.keys(nodeChildrenMap).map(Number),
    ...Object.keys(legacy.dataMap).map(Number),
    ...Object.keys(legacy.styleMap).map(Number),
    ...pageIds,
  ]);

  for (const id of knownIds) {
    if (id === ROOT_PARENT_ID) continue;

    const legacyData = legacy.dataMap[id] ?? {};
    const kind = toNodeKind(
      legacyData.type ??
        (legacyData.unit || legacyData.isLeaf ? "core:text" : "core:container"),
    );

    const isLeaf =
      legacyData.isLeaf ??
      legacyData.unit ??
      (isCoreNodeKind(kind) && LEAF_KIND_SET.has(kind));
    const hasChildren = (nodeChildrenMap[id] || []).length > 0;
    const resolvedKind: NodeKind = hasChildren
      ? kind === "core:root"
        ? "core:root"
        : "core:container"
      : isLeaf && isCoreContainerNodeKind(kind)
        ? "core:text"
        : kind;
    nodeRecordMap[id] = toCanonicalNode({
      kind: resolvedKind,
      raw: legacyData,
    });

    const legacyStyle = legacy.styleMap[id] || {};
    nodeStyleMap[id] = {
      default: legacyStyle.default || {},
      hover: legacyStyle.hover || {},
      active: legacyStyle.active || {},
    };

    nodeChildrenMap[id] = nodeChildrenMap[id] || [];
  }

  return assertDocumentConsistency({
    version: DOCUMENT_VERSION,
    pageIds,
    nodeChildrenMap,
    nodeRecordMap,
    nodeStyleMap,
  });
};

const migrateCanonicalDocumentV1 = (raw: unknown): Document => {
  const source = structuredClone(raw) as {
    nodeRecordMap?: Record<string, Record<string, unknown>>;
  };
  if (source.nodeRecordMap) {
    for (const [id, nodeRecord] of Object.entries(source.nodeRecordMap)) {
      if (!nodeRecord || typeof nodeRecord !== "object") continue;
      source.nodeRecordMap[id] = {
        ...nodeRecord,
        styleUi: normalizeStyleUi({
          styleUi: nodeRecord.styleUi as NodeStyleUi | undefined,
          cssData: nodeRecord.cssData as LegacyNodeCssData | undefined,
        }),
      };
      delete source.nodeRecordMap[id].cssData;
    }
  }

  const canonical = zCanonicalDocumentV1.parse(source);

  const normalizedRecordMap = Object.entries(source.nodeRecordMap || {}).reduce(
    (acc, [id, node]) => {
      if (!node || typeof node !== "object") return acc;
      acc[Number(id)] = toCanonicalNodeFromUnknown(
        node as Record<string, unknown>,
      );
      return acc;
    },
    {} as NodeRecordMap,
  );

  return assertDocumentConsistency({
    version: DOCUMENT_VERSION,
    nodeChildrenMap: toNumberKeyedMap(canonical.nodeChildrenMap),
    nodeRecordMap: normalizedRecordMap,
    nodeStyleMap: toNumberKeyedMap(canonical.nodeStyleMap),
    pageIds: canonical.pageIds,
    metadata: canonical.metadata,
  });
};

const migrateCanonicalDocumentV2 = (raw: unknown): Document => {
  const source = structuredClone(raw) as {
    nodeRecordMap?: Record<string, Record<string, unknown>>;
  };
  if (source.nodeRecordMap) {
    for (const [id, nodeRecord] of Object.entries(source.nodeRecordMap)) {
      if (!nodeRecord || typeof nodeRecord !== "object") continue;
      source.nodeRecordMap[id] = {
        ...nodeRecord,
        styleUi: normalizeStyleUi({
          styleUi: nodeRecord.styleUi as NodeStyleUi | undefined,
          cssData: nodeRecord.cssData as LegacyNodeCssData | undefined,
        }),
      };
      delete source.nodeRecordMap[id].cssData;
    }
  }

  const canonical = zCanonicalDocumentV2.parse(source);
  const normalizedRecordMap = Object.entries(
    canonical.nodeRecordMap as Record<string, Record<string, unknown>>,
  ).reduce(
    (acc, [id, node]) => {
      acc[Number(id)] = toCanonicalNodeFromUnknown(node);
      return acc;
    },
    {} as NodeRecordMap,
  );

  return assertDocumentConsistency({
    ...canonical,
    nodeChildrenMap: toNumberKeyedMap(canonical.nodeChildrenMap),
    nodeRecordMap: normalizedRecordMap,
    nodeStyleMap: toNumberKeyedMap(canonical.nodeStyleMap),
  });
};

export const migrateCanonicalDocument = (rawCanonical: unknown): Document => {
  const version = Number((rawCanonical as { version?: unknown })?.version);
  switch (version) {
    case 1:
      return migrateCanonicalDocumentV1(rawCanonical);
    case DOCUMENT_VERSION:
      return migrateCanonicalDocumentV2(rawCanonical);
    default:
      throw new Error(`Unsupported document version: ${String(version)}`);
  }
};

export const parseDocumentInput = (raw: unknown): Document => {
  const maybeVersion = (raw as { version?: unknown })?.version;
  if (typeof maybeVersion === "number") {
    return migrateCanonicalDocument(raw);
  }
  return migrateLegacyDocument(raw);
};
