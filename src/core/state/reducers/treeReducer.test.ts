import { describe, expect, it } from "vitest";
import type { TreeState } from "@core/types/document";
import treeReducer, {
  addDocument,
  cut,
  paste,
  redo,
  undo,
  updateActiveNode,
  updateBgContentRect,
  updateHoverNodeId,
  updateStyleMap,
} from "./treeReducer";

const createTreeState = (): TreeState => ({
  pageIds: [1],
  nodeChildrenMap: { [-1]: [1], 1: [2], 2: [] },
  nodeRecordMap: {
    1: { type: "core:root", name: "Page 1" },
    2: { type: "core:text", name: "Text 1", content: "hello" },
  },
  nodeStyleMap: {
    1: { default: { width: "100%" }, hover: {}, active: {} },
    2: { default: { color: "#111111" }, hover: {}, active: {} },
  },
  activeNodeId: 2,
  hoverNodeId: null,
  activePageId: 1,
  bgContentRect: { width: 0, height: 0, top: 0, left: 0 },
  clipboard: { cut: null, copy: null },
  cssState: "default",
  pageOpenMap: { 1: true },
});

describe("treeReducer history", () => {
  it("undoes and redoes a style update", () => {
    let state = treeReducer(undefined, addDocument(createTreeState()));
    state = treeReducer(
      state,
      updateStyleMap({
        id: 2,
        cssState: "default",
        style: { color: "#ff0000" },
      }),
    );

    expect(state.nodeStyleMap[2].default.color).toBe("#ff0000");
    expect(state.history?.past.length).toBe(1);
    expect(state.history?.future.length).toBe(0);

    state = treeReducer(state, undo());
    expect(state.nodeStyleMap[2].default.color).toBe("#111111");
    expect(state.history?.past.length).toBe(0);
    expect(state.history?.future.length).toBe(1);

    state = treeReducer(state, redo());
    expect(state.nodeStyleMap[2].default.color).toBe("#ff0000");
    expect(state.history?.past.length).toBe(1);
    expect(state.history?.future.length).toBe(0);
  });

  it("clears redo stack after a new mutation", () => {
    let state = treeReducer(undefined, addDocument(createTreeState()));
    state = treeReducer(
      state,
      updateStyleMap({
        id: 2,
        cssState: "default",
        style: { color: "#ff0000" },
      }),
    );
    state = treeReducer(
      state,
      updateStyleMap({
        id: 2,
        cssState: "default",
        style: { color: "#0000ff" },
      }),
    );
    state = treeReducer(state, undo());
    expect(state.nodeStyleMap[2].default.color).toBe("#ff0000");
    expect(state.history?.future.length).toBe(1);

    state = treeReducer(
      state,
      updateStyleMap({
        id: 2,
        cssState: "default",
        style: { color: "#00ff00" },
      }),
    );
    expect(state.nodeStyleMap[2].default.color).toBe("#00ff00");
    expect(state.history?.future.length).toBe(0);

    const afterRedo = treeReducer(state, redo());
    expect(afterRedo.nodeStyleMap[2].default.color).toBe("#00ff00");
    expect(afterRedo.history?.future.length).toBe(0);
  });

  it("ignores non-edit session updates", () => {
    let state = treeReducer(undefined, addDocument(createTreeState()));
    state = treeReducer(state, updateHoverNodeId({ id: 2 }));
    state = treeReducer(
      state,
      updateBgContentRect({
        bgContentRect: { width: 10, height: 10, top: 1, left: 1 },
      }),
    );
    expect(state.history?.past.length).toBe(0);
    expect(state.history?.future.length).toBe(0);
  });

  it("undoes and redoes cut", () => {
    let state = treeReducer(undefined, addDocument(createTreeState()));
    state = treeReducer(state, cut());

    expect(state.nodeChildrenMap[1]).toEqual([]);
    expect(state.clipboard.cut).toBe(2);
    expect(state.history?.past.length).toBe(1);

    state = treeReducer(state, undo());
    expect(state.nodeChildrenMap[1]).toEqual([2]);
    expect(state.clipboard.cut).toBeNull();
    expect(state.history?.future.length).toBe(1);

    state = treeReducer(state, redo());
    expect(state.nodeChildrenMap[1]).toEqual([]);
    expect(state.clipboard.cut).toBe(2);
  });

  it("undoes cut+paste sequence stepwise", () => {
    let state = treeReducer(undefined, addDocument(createTreeState()));
    state = treeReducer(state, cut());
    state = treeReducer(state, updateActiveNode({ id: 1 }));
    state = treeReducer(state, paste());

    expect(state.nodeChildrenMap[1]).toEqual([2]);
    expect(state.clipboard.cut).toBeNull();
    expect(state.clipboard.copy).toBe(2);
    expect(state.history?.past.length).toBe(2);

    state = treeReducer(state, undo());
    expect(state.nodeChildrenMap[1]).toEqual([]);
    expect(state.clipboard.cut).toBe(2);

    state = treeReducer(state, undo());
    expect(state.nodeChildrenMap[1]).toEqual([2]);
    expect(state.clipboard.cut).toBeNull();
  });
});
