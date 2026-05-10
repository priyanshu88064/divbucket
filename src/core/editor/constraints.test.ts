import { describe, expect, it } from "vitest";
import { createBootstrappedEditorRegistry } from "@core/kernel/bootstrap";
import type { TreeState } from "@core/types/document";
import {
  canInsertChildKindAtParent,
  canPlaceChildKindAtTarget,
  isNodeKindContainer,
} from "./constraints";
import { ROOT_COLLECTION_ID } from "./treeRelations";

const styleBucket = { default: {}, hover: {}, active: {} };

const makeState = (): TreeState => ({
  pageIds: [1],
  nodeChildrenMap: {
    [ROOT_COLLECTION_ID]: [1],
    1: [2, 3, 5],
    2: [4],
    3: [],
    4: [],
    5: [],
    6: [],
  },
  nodeRecordMap: {
    1: { type: "core:root", name: "Page" },
    2: { type: "core:container", name: "Container" },
    3: { type: "core:text", name: "Text", content: "hello" },
    4: { type: "core:text", name: "Child", content: "child" },
    5: { type: "core:list", name: "List" },
    6: { type: "core:listItem", name: "Item", content: "item" },
  },
  nodeStyleMap: {
    1: styleBucket,
    2: styleBucket,
    3: styleBucket,
    4: styleBucket,
    5: styleBucket,
    6: styleBucket,
  },
  activeNodeId: 2,
  hoverNodeId: null,
  activePageId: 1,
  pageOpenMap: { 1: true },
  bgContentRect: { width: 0, height: 0, top: 0, left: 0 },
  clipboard: { cut: null, copy: null },
  cssState: "default",
});

describe("constraints", () => {
  const registry = createBootstrappedEditorRegistry();

  it("reads container capability from registry metadata", () => {
    expect(isNodeKindContainer("core:container", registry)).toBe(true);
    expect(isNodeKindContainer("core:text", registry)).toBe(false);
  });

  it("enforces list child acceptance from node definitions", () => {
    const state = makeState();

    expect(
      canInsertChildKindAtParent({
        state,
        parentId: 5,
        childKind: "core:listItem",
        registry,
      }),
    ).toBe(true);

    expect(
      canInsertChildKindAtParent({
        state,
        parentId: 5,
        childKind: "core:text",
        registry,
      }),
    ).toBe(false);
  });

  it("keeps root collection legality as a kernel rule", () => {
    const state = makeState();

    expect(
      canInsertChildKindAtParent({
        state,
        parentId: ROOT_COLLECTION_ID,
        childKind: "core:root",
        registry,
      }),
    ).toBe(true);

    expect(
      canInsertChildKindAtParent({
        state,
        parentId: ROOT_COLLECTION_ID,
        childKind: "core:text",
        registry,
      }),
    ).toBe(false);
  });

  it("rejects invalid target placements before drag/drop advertises them", () => {
    const state = makeState();

    expect(
      canPlaceChildKindAtTarget({
        state,
        childKind: "core:text",
        target: { referenceNodeId: 5, placement: "inside" },
        registry,
      }),
    ).toBe(false);

    expect(
      canPlaceChildKindAtTarget({
        state,
        childKind: "core:listItem",
        target: { referenceNodeId: 5, placement: "inside" },
        registry,
      }),
    ).toBe(true);
  });
});
