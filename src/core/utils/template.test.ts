import { describe, expect, it } from "vitest";
import type { NodeKind, TreeState } from "@core/types/document";
import { instantiateTemplate } from "./template";
import { createBootstrappedEditorRegistry } from "@core/kernel/bootstrap";

const runtimeKinds = new Set<NodeKind>([
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
]);

const makeTreeState = (): Pick<
  TreeState,
  "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
> => ({
  pageIds: [],
  nodeChildrenMap: {},
  nodeRecordMap: {},
  nodeStyleMap: {},
});

const assertTemplateInvariants = (
  result: ReturnType<typeof instantiateTemplate>,
) => {
  const ids = Object.keys(result.nodeRecordMap).map(Number);
  const unique = new Set(ids);

  expect(ids.length).toBeGreaterThan(0);
  expect(unique.size).toBe(ids.length);
  expect(result.nodeRecordMap[result.rootId]).toBeDefined();
  expect(result.nodeStyleMap[result.rootId]).toBeDefined();
  expect(result.nodeChildrenMap[result.rootId]).toBeDefined();

  for (const id of ids) {
    const record = result.nodeRecordMap[id];
    expect(record).toBeDefined();
    expect(runtimeKinds.has(record.type)).toBe(true);
    expect(result.nodeStyleMap[id]).toBeDefined();
    expect(result.nodeChildrenMap[id]).toBeDefined();
    for (const childId of result.nodeChildrenMap[id]) {
      expect(result.nodeRecordMap[childId]).toBeDefined();
      expect(result.nodeStyleMap[childId]).toBeDefined();
      expect(result.nodeChildrenMap[childId]).toBeDefined();
    }
  }
};

describe("instantiateTemplate", () => {
  const registry = createBootstrappedEditorRegistry();

  it("creates valid maps for representative presets", () => {
    const treeState = makeTreeState();
    const presets = [
      "core:page",
      "core:container",
      "core:navbar",
      "core:hero",
      "core:feature",
      "core:card",
    ] as const;

    for (const type of presets) {
      const result = instantiateTemplate({ type, treeState, registry });
      assertTemplateInvariants(result);
      if (type === "core:page") {
        expect(result.nodeRecordMap[result.rootId].type).toBe("core:root");
      }
    }
  });

  it("creates disjoint IDs across repeated calls with updated state", () => {
    const state = makeTreeState();
    const first = instantiateTemplate({
      type: "core:feature",
      treeState: state,
      registry,
    });

    const second = instantiateTemplate({
      type: "core:feature",
      treeState: {
        pageIds: state.pageIds,
        nodeChildrenMap: { ...state.nodeChildrenMap, ...first.nodeChildrenMap },
        nodeRecordMap: { ...state.nodeRecordMap, ...first.nodeRecordMap },
        nodeStyleMap: { ...state.nodeStyleMap, ...first.nodeStyleMap },
      },
      registry,
    });

    const firstIds = new Set(Object.keys(first.nodeRecordMap).map(Number));
    const secondIds = Object.keys(second.nodeRecordMap).map(Number);
    expect(secondIds.every((id) => !firstIds.has(id))).toBe(true);
  });

  it("supports naming override on root record", () => {
    const result = instantiateTemplate({
      type: "core:container",
      treeState: makeTreeState(),
      name: "Custom Name",
      registry,
    });

    expect(result.nodeRecordMap[result.rootId].name).toBe("Custom Name");
  });
});
