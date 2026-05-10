import { describe, expect, it } from "vitest";
import type { Document } from "@core/types/document";
import { amplifyDocument } from "./amplifyDocument";

const baseDocument: Document = {
  version: 2,
  pageIds: [1],
  nodeChildrenMap: {
    [-1]: [1],
    1: [2],
    2: [],
  },
  nodeRecordMap: {
    1: { type: "core:root", name: "Page" },
    2: { type: "core:heading", name: "Title", content: "hello" },
  },
  nodeStyleMap: {
    1: { default: { width: "100%" }, hover: {}, active: {} },
    2: { default: { color: "#111" }, hover: {}, active: {} },
  },
};

describe("amplifyDocument", () => {
  it("duplicates page subtrees with unique ids", () => {
    const amplified = amplifyDocument({ document: baseDocument, copies: 3 });
    expect(amplified.pageIds).toHaveLength(3);
    expect(new Set(amplified.pageIds).size).toBe(3);
    expect(amplified.nodeChildrenMap[-1]).toEqual(amplified.pageIds);
  });

  it("returns original document when copies is <= 1", () => {
    expect(amplifyDocument({ document: baseDocument, copies: 1 })).toBe(
      baseDocument,
    );
  });
});
