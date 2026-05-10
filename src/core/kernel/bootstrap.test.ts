import { describe, expect, it } from "vitest";
import type { ComponentType } from "react";
import type { EditorPlugin, EditPanelProps, NodeTypeDefinition } from "./types";
import { createBootstrappedEditorRegistry } from "./bootstrap";
import { CORE_RUNTIME_NODE_KINDS } from "@plugins/core/nodes";
import { CORE_PRESET_IDS } from "@plugins/core/presets";
import { CORE_STYLE_SECTIONS } from "@plugins/core/styles";
import { DEFAULT_EDIT_PANEL_ID } from "@plugins/core/edit-panels";

const makeNoopPlugin = (id: string, dependsOn?: string[]): EditorPlugin => ({
  id,
  dependsOn,
  register: () => undefined,
});

const DummyEditPanel: ComponentType<EditPanelProps> = () => null;

const makeTestNodeDefinition = (
  kind: NodeTypeDefinition["kind"],
): NodeTypeDefinition => ({
  kind,
  label: `Node ${kind}`,
  icon: () => null,
  isContainer: false,
  sidebar: {
    visible: true,
    group: "Elements",
    order: 1,
  },
  renderer: () => null,
  createRecord: () => ({ name: kind, type: kind } as never),
  createStyle: () => ({}),
});

describe("editor registry bootstrap", () => {
  it("loads built-in plugins into a usable registry", () => {
    const registry = createBootstrappedEditorRegistry();

    expect(registry.nodes.size).toBe(CORE_RUNTIME_NODE_KINDS.length);
    CORE_RUNTIME_NODE_KINDS.forEach((kind) => {
      const node = registry.getNodeType(kind);
      expect(node).toBeDefined();
      expect(node?.label).toBeTruthy();
      expect(typeof node?.icon).toBe("function");
      expect(typeof node?.renderer).toBe("function");
      expect(node?.sidebar).toBeDefined();
    });

    const visibleSidebarKinds = registry
      .listNodeTypes()
      .filter((node) => node.sidebar.visible)
      .map((node) => node.kind);
    expect(visibleSidebarKinds).not.toContain("core:root");

    expect(registry.presets.size).toBe(CORE_PRESET_IDS.length);
    expect(registry.listPresets().map((preset) => preset.id)).toEqual(
      CORE_PRESET_IDS,
    );
    CORE_PRESET_IDS.forEach((presetId) => {
      const preset = registry.getPreset(presetId);
      expect(preset).toBeDefined();
      expect(preset?.label).toBeTruthy();
      expect(preset?.group).toBeTruthy();
      expect(typeof preset?.order).toBe("number");
    });

    expect(registry.listStyleSections().map((section) => section.id)).toEqual(
      CORE_STYLE_SECTIONS.map((section) => section.id),
    );
    expect(registry.getEditPanel(DEFAULT_EDIT_PANEL_ID)).toBeDefined();
  });

  it("throws for duplicate plugin ids", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        makeNoopPlugin("plugin.a"),
        makeNoopPlugin("plugin.a"),
      ]),
    ).toThrow(/Duplicate plugin id/);
  });

  it("throws for missing plugin dependencies", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        makeNoopPlugin("plugin.a"),
        makeNoopPlugin("plugin.b", ["plugin.c"]),
      ]),
    ).toThrow(/Missing plugin dependency/);
  });

  it("registers plugins in dependency order even when input order is unsorted", () => {
    const registrationOrder: string[] = [];
    const makeOrderedPlugin = (
      id: string,
      dependsOn?: string[],
    ): EditorPlugin => ({
      id,
      dependsOn,
      register: () => {
        registrationOrder.push(id);
      },
    });

    createBootstrappedEditorRegistry([
      makeOrderedPlugin("plugin.b", ["plugin.a"]),
      makeOrderedPlugin("plugin.c", ["plugin.b"]),
      makeOrderedPlugin("plugin.a"),
    ]);

    expect(registrationOrder).toEqual(["plugin.a", "plugin.b", "plugin.c"]);
  });

  it("throws for self dependencies", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        makeNoopPlugin("plugin.a", ["plugin.a"]),
      ]),
    ).toThrow(/cannot depend on itself/);
  });

  it("throws for cyclic dependencies", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        makeNoopPlugin("plugin.a", ["plugin.b"]),
        makeNoopPlugin("plugin.b", ["plugin.c"]),
        makeNoopPlugin("plugin.c", ["plugin.a"]),
      ]),
    ).toThrow(/Cyclic plugin dependency detected/);
  });

  it("throws for duplicate node kinds", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.nodes-a",
          register: (api) => {
            api.registerNodeType(makeTestNodeDefinition("core:text"));
          },
        },
        {
          id: "plugin.nodes-b",
          register: (api) => {
            api.registerNodeType(makeTestNodeDefinition("core:text"));
          },
        },
      ]),
    ).toThrow(/Duplicate node kind registration/);
  });

  it("throws for duplicate preset ids", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.presets-a",
          register: (api) => {
            api.registerPreset({
              id: "core:hero",
              label: "Hero A",
              group: "Sections",
              order: 1,
              instantiate: () => ({
                rootId: 0,
                nodeChildrenMap: { 0: [] },
                nodeRecordMap: { 0: { name: "core:container", type: "core:container" } },
                nodeStyleMap: { 0: { default: {}, hover: {}, active: {} } },
              }),
            });
          },
        },
        {
          id: "plugin.presets-b",
          register: (api) => {
            api.registerPreset({
              id: "core:hero",
              label: "Hero B",
              group: "Sections",
              order: 2,
              instantiate: () => ({
                rootId: 0,
                nodeChildrenMap: { 0: [] },
                nodeRecordMap: { 0: { name: "core:container", type: "core:container" } },
                nodeStyleMap: { 0: { default: {}, hover: {}, active: {} } },
              }),
            });
          },
        },
      ]),
    ).toThrow(/Duplicate preset id registration/);
  });

  it("throws for duplicate style section ids", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.styles-a",
          register: (api) => {
            api.registerStyleSection({
              id: "layout",
              title: "Layout A",
              fields: [],
            });
          },
        },
        {
          id: "plugin.styles-b",
          register: (api) => {
            api.registerStyleSection({
              id: "layout",
              title: "Layout B",
              fields: [],
            });
          },
        },
      ]),
    ).toThrow(/Duplicate style section id registration/);
  });

  it("throws for duplicate edit panel ids", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.edit-a",
          register: (api) => {
            api.registerEditPanel({
              id: "default",
              component: DummyEditPanel,
            });
          },
        },
        {
          id: "plugin.edit-b",
          register: (api) => {
            api.registerEditPanel({
              id: "default",
              component: DummyEditPanel,
            });
          },
        },
      ]),
    ).toThrow(/Duplicate edit panel id registration/);
  });

  it("throws when a node references unknown style section ids", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.nodes",
          register: (api) => {
            api.registerNodeType({
              ...makeTestNodeDefinition("core:text"),
              styles: { sectionIds: ["missing-style-section"] },
            });
          },
        },
      ]),
    ).toThrow(/Unknown style section/);
  });

  it("throws when a node references an unknown edit panel id", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.nodes",
          register: (api) => {
            api.registerNodeType({
              ...makeTestNodeDefinition("core:text"),
              edit: {
                panelId: "missing-edit-panel",
                fields: ["name"],
              },
            });
          },
        },
      ]),
    ).toThrow(/Unknown edit panel/);
  });

  it("throws when a preset requires an unknown node kind", () => {
    expect(() =>
      createBootstrappedEditorRegistry([
        {
          id: "plugin.presets",
          register: (api) => {
            api.registerPreset({
              id: "core:card",
              label: "Card",
              group: "Sections",
              order: 1,
              requires: ["core:container"],
              instantiate: ({ registry }) => {
                const node = registry.getNodeType("core:container");
                if (!node) {
                  throw new Error("Missing container node");
                }
                return {
                  rootId: 0,
                  nodeChildrenMap: { 0: [] },
                  nodeRecordMap: { 0: node.createRecord() },
                  nodeStyleMap: { 0: { default: {}, hover: {}, active: {} } },
                };
              },
            });
          },
        },
      ]),
    ).toThrow(/Unknown required node kind/);
  });
});
