import { describe, expect, it } from "vitest";
import type { TreeState } from "@core/types/document";
import { allocateNodeId, createNodeIdAllocator } from "./idAllocator";
import {
  copyNode,
  cutNode,
  deleteNode,
  duplicateNode,
  insertNode,
  moveNode,
  pasteNode,
  updateNodeRecord,
  updateNodeStyle,
} from "./operations";
import type { EditorOperationResult } from "./types";
import {
  getParentNodeId,
  isDescendantNode,
  ROOT_COLLECTION_ID,
} from "./treeRelations";

const styleBucket = { default: {}, hover: {}, active: {} };

const makeState = (): TreeState => ({
  pageIds: [1],
  nodeChildrenMap: {
    [ROOT_COLLECTION_ID]: [1],
    1: [2, 3],
    2: [4],
    3: [],
    4: [],
  },
  nodeRecordMap: {
    1: { type: "core:root", name: "Page" },
    2: { type: "core:container", name: "Container" },
    3: { type: "core:text", name: "Text", content: "hello" },
    4: { type: "core:text", name: "Child", content: "child" },
  },
  nodeStyleMap: {
    1: styleBucket,
    2: styleBucket,
    3: styleBucket,
    4: styleBucket,
  },
  activeNodeId: 2,
  hoverNodeId: null,
  activePageId: 1,
  pageOpenMap: { 1: true },
  bgContentRect: { width: 0, height: 0, top: 0, left: 0 },
  clipboard: { cut: null, copy: null },
  cssState: "default",
});

const apply = (state: TreeState, result: EditorOperationResult): TreeState => ({
  ...state,
  ...result.document,
  ...result.session,
});

describe("idAllocator", () => {
  it("allocates monotonically above highest existing id", () => {
    const state = makeState();
    state.nodeChildrenMap[99] = [];
    state.nodeRecordMap[99] = { type: "core:text", name: "T", content: "x" };
    state.nodeStyleMap[99] = styleBucket;

    expect(allocateNodeId(state)).toBe(100);

    const alloc = createNodeIdAllocator(state);
    expect(alloc()).toBe(100);
    expect(alloc()).toBe(101);
    expect(alloc()).toBe(102);
  });
});

describe("treeRelations", () => {
  it("finds parent nodes from root collection", () => {
    const state = makeState();

    expect(getParentNodeId(state.nodeChildrenMap, ROOT_COLLECTION_ID, 1)).toBe(
      ROOT_COLLECTION_ID,
    );
    expect(getParentNodeId(state.nodeChildrenMap, ROOT_COLLECTION_ID, 2)).toBe(
      1,
    );
    expect(getParentNodeId(state.nodeChildrenMap, ROOT_COLLECTION_ID, 4)).toBe(
      2,
    );
    expect(
      getParentNodeId(state.nodeChildrenMap, ROOT_COLLECTION_ID, 99),
    ).toBeNull();
  });

  it("detects descendant relations correctly", () => {
    const state = makeState();

    expect(isDescendantNode(state.nodeChildrenMap, 1, 4)).toBe(true);
    expect(isDescendantNode(state.nodeChildrenMap, 2, 4)).toBe(true);
    expect(isDescendantNode(state.nodeChildrenMap, 3, 4)).toBe(false);
    expect(isDescendantNode(state.nodeChildrenMap, 4, 1)).toBe(false);
  });
});

describe("operations", () => {
  it("rejects insert inside a leaf node", () => {
    const state = makeState();
    const result = insertNode(state, { parent: 3, child: 10 });
    expect(result.error).toBe("Invalid parent");
  });

  it("adds node inside a container parent", () => {
    const state = makeState();
    state.nodeRecordMap[5] = { type: "core:text", name: "New", content: "new" };
    state.nodeStyleMap[5] = styleBucket;
    state.nodeChildrenMap[5] = [];

    const result = insertNode(state, { parent: 2, child: 5 });
    expect(result.error).toBeUndefined();
    expect(result.document?.nodeChildrenMap?.[2]).toEqual([4, 5]);
  });

  it("rejects inserting non-listItem nodes inside list containers", () => {
    const state = makeState();
    state.nodeChildrenMap[5] = [];
    state.nodeRecordMap[5] = { type: "core:list", name: "List" };
    state.nodeStyleMap[5] = styleBucket;
    state.nodeChildrenMap[1] = [2, 3, 5];

    state.nodeChildrenMap[6] = [];
    state.nodeRecordMap[6] = { type: "core:image", name: "Image", media: { src: "/x.png" } };
    state.nodeStyleMap[6] = styleBucket;

    const result = insertNode(state, { parent: 5, child: 6 });
    expect(result.error).toBe("Invalid parent");
  });

  it("allows inserting listItem nodes inside list containers", () => {
    const state = makeState();
    state.nodeChildrenMap[5] = [];
    state.nodeRecordMap[5] = { type: "core:list", name: "List" };
    state.nodeStyleMap[5] = styleBucket;
    state.nodeChildrenMap[1] = [2, 3, 5];

    state.nodeChildrenMap[6] = [];
    state.nodeRecordMap[6] = {
      type: "core:listItem",
      name: "Item",
      content: "hello",
    };
    state.nodeStyleMap[6] = styleBucket;

    const result = insertNode(state, { parent: 5, child: 6 });
    expect(result.error).toBeUndefined();
    expect(result.document?.nodeChildrenMap?.[5]).toEqual([6]);
  });

  it("deletes a subtree and updates active selection to parent", () => {
    const state = makeState();
    state.activeNodeId = 2;

    const result = deleteNode(state, { id: 2 });
    expect(result.error).toBeUndefined();
    expect(result.document?.nodeChildrenMap?.[1]).toEqual([3]);
    expect(result.document?.nodeRecordMap?.[2]).toBeUndefined();
    expect(result.document?.nodeRecordMap?.[4]).toBeUndefined();
    expect(result.session?.activeNodeId).toBe(1);
  });

  it("moves nodes before, after, and inside", () => {
    const initial = makeState();

    const before = moveNode(initial, {
      node: 3,
      target: { referenceNodeId: 2, placement: "before" },
    });
    expect(before.error).toBeUndefined();
    expect(before.document?.nodeChildrenMap?.[1]).toEqual([3, 2]);

    const after = moveNode(initial, {
      node: 2,
      target: { referenceNodeId: 3, placement: "after" },
    });
    expect(after.error).toBeUndefined();
    expect(after.document?.nodeChildrenMap?.[1]).toEqual([3, 2]);

    const inside = moveNode(initial, {
      node: 3,
      target: { referenceNodeId: 2, placement: "inside" },
    });
    expect(inside.error).toBeUndefined();
    expect(inside.document?.nodeChildrenMap?.[1]).toEqual([2]);
    expect(inside.document?.nodeChildrenMap?.[2]).toEqual([4, 3]);
  });

  it("prevents illegal move into descendant", () => {
    const state = makeState();
    const result = moveNode(state, {
      node: 2,
      target: { referenceNodeId: 4, placement: "inside" },
    });

    expect(result.error).toBe("Illegal move");
  });

  it("prevents moving non-root nodes into root collection", () => {
    const state = makeState();
    const result = moveNode(state, {
      node: 2,
      target: { referenceNodeId: 1, placement: "before" },
    });

    expect(result.error).toBe("Illegal move");
  });

  it("prevents moving root page nodes inside non-root parents", () => {
    const state = makeState();
    state.nodeChildrenMap[ROOT_COLLECTION_ID] = [1, 10];
    state.pageIds = [1, 10];
    state.nodeChildrenMap[10] = [];
    state.nodeRecordMap[10] = { type: "core:root", name: "Page 2" };
    state.nodeStyleMap[10] = styleBucket;

    const result = moveNode(state, {
      node: 10,
      target: { referenceNodeId: 2, placement: "inside" },
    });

    expect(result.error).toBe("Illegal move");
  });

  it("prevents moving text nodes inside list containers", () => {
    const state = makeState();
    state.nodeChildrenMap[5] = [];
    state.nodeRecordMap[5] = { type: "core:list", name: "List" };
    state.nodeStyleMap[5] = styleBucket;
    state.nodeChildrenMap[1] = [2, 3, 5];

    const result = moveNode(state, {
      node: 3,
      target: { referenceNodeId: 5, placement: "inside" },
    });

    expect(result.error).toBe("Illegal move");
  });

  it("allows moving listItem nodes inside list containers", () => {
    const state = makeState();
    state.nodeChildrenMap[5] = [];
    state.nodeRecordMap[5] = { type: "core:list", name: "List" };
    state.nodeStyleMap[5] = styleBucket;
    state.nodeChildrenMap[1] = [2, 3, 5, 6];
    state.nodeChildrenMap[6] = [];
    state.nodeRecordMap[6] = {
      type: "core:listItem",
      name: "Item",
      content: "hello",
    };
    state.nodeStyleMap[6] = styleBucket;

    const result = moveNode(state, {
      node: 6,
      target: { referenceNodeId: 5, placement: "inside" },
    });

    expect(result.error).toBeUndefined();
    expect(result.document?.nodeChildrenMap?.[1]).toEqual([2, 3, 5]);
    expect(result.document?.nodeChildrenMap?.[5]).toEqual([6]);
  });

  it("duplicates subtree with fresh ids and focuses duplicate", () => {
    const state = makeState();
    state.activeNodeId = 2;

    const result = duplicateNode(state);
    expect(result.error).toBeUndefined();
    expect(result.document).toBeDefined();
    expect(result.session?.activeNodeId).toBe(5);

    const children = result.document?.nodeChildrenMap?.[1];
    expect(children).toEqual([2, 5, 3]);
    expect(result.document?.nodeChildrenMap?.[5]).toEqual([6]);

    expect(result.document?.nodeRecordMap?.[5]).toEqual(state.nodeRecordMap[2]);
    expect(result.document?.nodeRecordMap?.[6]).toEqual(state.nodeRecordMap[4]);
    expect(result.document?.nodeStyleMap?.[5]).not.toBe(state.nodeStyleMap[2]);
  });

  it("cut then paste reattaches node, clears cut, and sets active", () => {
    const state = makeState();
    state.activeNodeId = 4;

    const cutResult = cutNode(state);
    expect(cutResult.error).toBeUndefined();
    expect(cutResult.session?.clipboard).toEqual({ cut: 4, copy: null });

    const pasteState = apply(state, cutResult);
    pasteState.activeNodeId = 1;

    const pasteResult = pasteNode(pasteState);
    expect(pasteResult.error).toBeUndefined();
    expect(pasteResult.document?.nodeChildrenMap?.[1]).toContain(4);
    expect(pasteResult.session?.clipboard).toEqual({ cut: null, copy: 4 });
    expect(pasteResult.session?.activeNodeId).toBe(4);
  });

  it("copy then paste creates new ids and keeps original subtree", () => {
    const state = makeState();
    state.activeNodeId = 2;

    const copyResult = copyNode(state);
    expect(copyResult.error).toBeUndefined();

    const pasteState = apply(state, copyResult);
    pasteState.activeNodeId = 1;

    const pasteResult = pasteNode(pasteState);
    expect(pasteResult.error).toBeUndefined();
    expect(pasteResult.session?.activeNodeId).toBe(5);
    expect(pasteResult.document?.nodeChildrenMap?.[1]).toEqual([2, 3, 5]);
    expect(pasteResult.document?.nodeChildrenMap?.[5]).toEqual([6]);
    expect(pasteResult.document?.nodeRecordMap?.[2]).toEqual(
      state.nodeRecordMap[2],
    );
    expect(pasteResult.document?.nodeRecordMap?.[5]).toEqual(
      state.nodeRecordMap[2],
    );
  });

  it("prevents paste inside leaf node target", () => {
    const state = makeState();
    state.activeNodeId = 2;
    const copyResult = copyNode(state);
    const pasteState = apply(state, copyResult);
    pasteState.activeNodeId = 3;

    const pasteResult = pasteNode(pasteState);
    expect(pasteResult.error).toBe("Invalid paste target");
  });

  it("updates only the requested css state style bucket", () => {
    const state = makeState();
    state.nodeStyleMap[2] = {
      default: { color: "#111111" },
      hover: { color: "#222222" },
      active: { color: "#333333" },
    };

    const result = updateNodeStyle(state, {
      id: 2,
      cssState: "hover",
      style: { color: "#ffffff", marginTop: "10px" },
    });

    expect(result.document?.nodeStyleMap?.[2].default).toEqual({
      color: "#111111",
    });
    expect(result.document?.nodeStyleMap?.[2].hover).toEqual({
      color: "#ffffff",
      marginTop: "10px",
    });
    expect(result.document?.nodeStyleMap?.[2].active).toEqual({
      color: "#333333",
    });
  });

  it("updates style metadata on node records without mutating style buckets", () => {
    const state = makeState();
    state.nodeRecordMap[2] = { ...state.nodeRecordMap[2], styleUi: undefined };
    state.nodeStyleMap[2] = {
      default: { backgroundColor: "#ffffff" },
      hover: {},
      active: {},
    };

    const result = updateNodeRecord(state, {
      id: 2,
      data: {
        ...state.nodeRecordMap[2],
        styleUi: {
          background: { mode: "Solid" },
          spacing: { margin: { linkMode: "x" } },
        },
      },
    });

    expect(result.document?.nodeRecordMap?.[2].styleUi).toEqual({
      background: { mode: "Solid" },
      spacing: { margin: { linkMode: "x" } },
    });
    expect(result.document?.nodeStyleMap?.[2]).toEqual({
      default: { backgroundColor: "#ffffff" },
      hover: {},
      active: {},
    });
  });

  it("sanitizes non-serializable style values during operations", () => {
    const state = makeState();
    state.nodeStyleMap[2] = {
      default: {
        color: "red",
        ...({
          unsafe: (() => "nope") as unknown as string,
        } as Record<string, string>),
      },
      hover: {},
      active: {},
    };

    expect(() =>
      moveNode(state, {
        node: 3,
        target: { referenceNodeId: 2, placement: "inside" },
      }),
    ).not.toThrow();

    const result = updateNodeStyle(state, {
      id: 2,
      cssState: "default",
      style: {
        ...state.nodeStyleMap[2].default,
        backgroundColor: "blue",
      },
    });

    expect(result.document?.nodeStyleMap?.[2].default).toEqual({
      color: "red",
      backgroundColor: "blue",
    });
  });

  it("sanitizes non-serializable node record values during updates", () => {
    const state = makeState();

    const result = updateNodeRecord(state, {
      id: 2,
      data: {
        ...state.nodeRecordMap[2],
        styleUi: {
          background: { mode: "Solid" },
          unsafe: (() => "nope") as unknown,
        } as any,
      },
    });

    expect(result.document?.nodeRecordMap?.[2]).toEqual({
      ...state.nodeRecordMap[2],
      styleUi: {
        background: { mode: "Solid" },
      },
    });
  });
});
