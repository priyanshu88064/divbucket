import { describe, expect, it } from "vitest";
import type { RootState } from "../store";
import { selectExportDocumentState, selectNodeChildrenById } from "./treeSelectors";

const createState = (): RootState => ({
  treeReducer: {
    pageIds: [1],
    nodeChildrenMap: { [-1]: [1], 1: [2], 2: [] },
    nodeRecordMap: {
      1: { type: "core:root", name: "Page 1" },
      2: { type: "core:heading", name: "Title", content: "Hello" },
    },
    nodeStyleMap: {
      1: { default: { width: "100%" }, hover: {}, active: {} },
      2: { default: { color: "#111111" }, hover: {}, active: {} },
    },
    activeNodeId: 1,
    hoverNodeId: null,
    activePageId: 1,
    bgContentRect: { width: 0, height: 0, top: 0, left: 0 },
    clipboard: { cut: null, copy: null },
    cssState: "default",
    pageOpenMap: { 1: true },
  },
  focusReducer: { tab: "0" },
  previewReducer: { isOpen: false, pageId: null, viewportPreset: null },
});

describe("tree selectors", () => {
  it("returns stable export document selection when only session state changes", () => {
    const baseState = createState();
    const first = selectExportDocumentState(baseState);

    const nextState: RootState = {
      ...baseState,
      treeReducer: {
        ...baseState.treeReducer,
        activeNodeId: 2,
      },
    };

    const second = selectExportDocumentState(nextState);
    expect(second).toBe(first);
  });

  it("returns empty array for unknown node children", () => {
    const state = createState();
    expect(selectNodeChildrenById(state, 999)).toEqual([]);
  });
});
