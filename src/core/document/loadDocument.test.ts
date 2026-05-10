import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DOCUMENT_VERSION } from "@core/types/document";
import { loadDocument, mergeDocuments } from "./loadDocument";

const readProject = (name: string) => {
  const filePath = path.resolve(process.cwd(), "public", "projects", name);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

describe("loadDocument", () => {
  it("loads a small legacy project into canonical document format", () => {
    const raw = readProject("needhelp.json");
    const doc = loadDocument(raw);

    expect(doc.version).toBe(DOCUMENT_VERSION);
    expect(doc.pageIds.length).toBeGreaterThan(0);
    expect(doc.nodeChildrenMap[-1]).toEqual(doc.pageIds);
    expect(Object.keys(doc.nodeRecordMap).length).toBeGreaterThan(0);
    expect(Object.keys(doc.nodeStyleMap).length).toBeGreaterThan(0);

    for (const pageId of doc.pageIds) {
      expect(doc.nodeRecordMap[pageId].type).toBe("core:root");
    }
  });

  it("normalizes legacy cssData metadata into styleUi", () => {
    const legacy = {
      tree: { "-1": [1], "1": [2], "2": [] },
      dataMap: {
        "1": { name: "Page", type: "core:root" },
        "2": {
          name: "Box",
          type: "core:container",
          cssData: {
            backgroundType: "Solid",
            joints: {
              margin: { x: true },
              padding: { all: true },
            },
          },
        },
      },
      styleMap: {
        "1": { default: {}, hover: {}, active: {} },
        "2": { default: {}, hover: {}, active: {} },
      },
    };

    const doc = loadDocument(legacy);
    expect(doc.nodeRecordMap[2].styleUi?.background?.mode).toBe("Solid");
    expect(doc.nodeRecordMap[2].styleUi?.spacing?.margin?.linkMode).toBe("x");
    expect(doc.nodeRecordMap[2].styleUi?.spacing?.padding?.linkMode).toBe(
      "all",
    );
  });

  it("loads a large legacy project and keeps root ordering stable", () => {
    const raw = readProject("witcher.json");
    const doc = loadDocument(raw);

    expect(doc.pageIds).toEqual(doc.nodeChildrenMap[-1]);
    expect(doc.pageIds.length).toBeGreaterThan(0);
  });

  it("rejects unknown runtime kinds during migration", () => {
    const invalid = {
      tree: { "-1": [1], "1": [] },
      dataMap: { "1": { name: "X", type: "unknown_kind" } },
      styleMap: { "1": { default: {}, hover: {}, active: {} } },
    };

    expect(() => loadDocument(invalid)).toThrow(/Unknown node kind/);
  });

  it("rejects orphan children", () => {
    const invalid = {
      tree: { "-1": [1], "1": [2] },
      dataMap: { "1": { name: "core:root", type: "core:root" } },
      styleMap: { "1": { default: {}, hover: {}, active: {} } },
    };

    expect(() => loadDocument(invalid)).toThrow(/orphan child/);
  });

  it("rejects documents with missing root collection", () => {
    const invalid = {
      tree: { "1": [] },
      dataMap: { "1": { name: "A", type: "core:container" } },
      styleMap: { "1": { default: {}, hover: {}, active: {} } },
    };

    expect(() => loadDocument(invalid)).toThrow(/missing root collection/);
  });

  it("accepts canonical v1 documents", () => {
    const canonical = {
      version: DOCUMENT_VERSION,
      pageIds: [1],
      nodeChildrenMap: { "-1": [1], "1": [2], "2": [] },
      nodeRecordMap: {
        "1": { name: "Page", type: "core:root" },
        "2": { name: "Text", type: "core:text", content: "Hello" },
      },
      nodeStyleMap: {
        "1": { default: {}, hover: {}, active: {} },
        "2": { default: {}, hover: {}, active: {} },
      },
    };

    const doc = loadDocument(canonical);
    expect(doc.version).toBe(DOCUMENT_VERSION);
    expect(doc.pageIds).toEqual([1]);
    expect(doc.nodeChildrenMap[-1]).toEqual([1]);
  });

  it("accepts canonical docs that still carry legacy cssData and normalizes to styleUi", () => {
    const canonical = {
      version: DOCUMENT_VERSION,
      pageIds: [1],
      nodeChildrenMap: { "-1": [1], "1": [2], "2": [] },
      nodeRecordMap: {
        "1": { name: "Page", type: "core:root" },
        "2": {
          name: "Card",
          type: "core:container",
          cssData: { backgroundType: "URL" },
        },
      },
      nodeStyleMap: {
        "1": { default: {}, hover: {}, active: {} },
        "2": { default: {}, hover: {}, active: {} },
      },
    };

    const doc = loadDocument(canonical);
    expect(doc.nodeRecordMap[2].styleUi?.background?.mode).toBe("URL");
  });

  it("rejects canonical docs with invalid node field combinations", () => {
    const invalidCanonical = {
      version: DOCUMENT_VERSION,
      pageIds: [1],
      nodeChildrenMap: { "-1": [1], "1": [2], "2": [] },
      nodeRecordMap: {
        "1": { name: "Page", type: "core:root" },
        "2": { name: "BrokenImage", type: "core:image" },
      },
      nodeStyleMap: {
        "1": { default: {}, hover: {}, active: {} },
        "2": { default: {}, hover: {}, active: {} },
      },
    };

    expect(() => loadDocument(invalidCanonical)).toThrow();
  });

  it("rejects canonical docs with missing style buckets", () => {
    const invalidCanonical = {
      version: DOCUMENT_VERSION,
      pageIds: [1],
      nodeChildrenMap: { "-1": [1], "1": [] },
      nodeRecordMap: {
        "1": { name: "Page", type: "core:root" },
      },
      nodeStyleMap: {},
    };

    expect(() => loadDocument(invalidCanonical)).toThrow(
      /Missing style bucket/,
    );
  });

  it("rejects canonical docs with malformed styleUi values", () => {
    const invalidCanonical = {
      version: DOCUMENT_VERSION,
      pageIds: [1],
      nodeChildrenMap: { "-1": [1], "1": [2], "2": [] },
      nodeRecordMap: {
        "1": { name: "Page", type: "core:root" },
        "2": {
          name: "Text",
          type: "core:text",
          content: "ok",
          styleUi: {
            spacing: {
              margin: { linkMode: "xy" },
            },
          },
        },
      },
      nodeStyleMap: {
        "1": { default: {}, hover: {}, active: {} },
        "2": { default: {}, hover: {}, active: {} },
      },
    };

    expect(() => loadDocument(invalidCanonical)).toThrow();
  });
});

describe("mergeDocuments", () => {
  it("merges multiple canonical documents and preserves page ordering", () => {
    const needHelp = loadDocument(readProject("needhelp.json"));
    const divbucket = loadDocument(readProject("divbucket.json"));
    const merged = mergeDocuments([needHelp, divbucket]);

    expect(merged.pageIds.length).toEqual(
      needHelp.pageIds.length + divbucket.pageIds.length,
    );
    expect(merged.nodeChildrenMap[-1]).toEqual(merged.pageIds);
  });
});
