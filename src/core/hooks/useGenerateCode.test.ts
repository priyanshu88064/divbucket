import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RootState } from "@core/state/store";
import { useGenerateCode } from "./useGenerateCode";

const { useSelectorMock } = vi.hoisted(() => ({
  useSelectorMock: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: useSelectorMock,
}));

describe("useGenerateCode", () => {
  beforeEach(() => {
    useSelectorMock.mockReset();
  });

  it("returns html/css export from current Redux document state", () => {
    const state: RootState = {
      treeReducer: {
        pageIds: [1],
        nodeChildrenMap: { 1: [2], 2: [] },
        nodeRecordMap: {
          1: { type: "core:root", name: "Page" },
          2: { type: "core:heading", name: "title", content: "Welcome" },
        },
        nodeStyleMap: {
          1: {
            default: { width: "100%", minWidth: "300px", height: "400px" },
            hover: {},
            active: {},
          },
          2: {
            default: { color: "#111111" },
            hover: { color: "#222222" },
            active: {},
          },
        },
        activeNodeId: null,
        hoverNodeId: null,
        activePageId: 1,
        bgContentRect: { width: 0, height: 0, top: 0, left: 0 },
        clipboard: { cut: null, copy: null },
        cssState: "default",
        pageOpenMap: { 1: true },
      },
      focusReducer: {
        tab: "0",
      },
      previewReducer: {
        isOpen: false,
        pageSrc: "",
      },
    };

    useSelectorMock.mockImplementation((selector: (s: RootState) => unknown) =>
      selector(state),
    );

    const { generate } = useGenerateCode();
    const result = generate({ tab: 1, isInternalStyleSheet: false });

    expect(result).toEqual(
      expect.objectContaining({
        html: expect.any(String),
        css: expect.any(String),
      }),
    );
    expect(result.html).toContain("<h1");
    expect(result.css).toContain(".db-heading-2");
    expect(result.css).toContain("body {");
  });
});
