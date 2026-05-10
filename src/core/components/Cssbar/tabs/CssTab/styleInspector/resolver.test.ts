import { describe, expect, it } from "vitest";
import { createBootstrappedEditorRegistry } from "@core/kernel/bootstrap";
import type { StyleInspectorContext } from "./types";
import type { NodeRecord } from "@core/types/document";
import { resolveStyleSectionsForNode } from "./resolver";

const makeCtx = (
  nodeType: StyleInspectorContext["node"]["type"],
): StyleInspectorContext => ({
  id: 1,
  node: (
    nodeType === "core:text"
      ? { type: "core:text", name: "core:text", content: "hello" }
      : nodeType === "core:image"
        ? { type: "core:image", name: "core:image", media: { src: "/x.png" } }
        : nodeType === "core:video"
          ? { type: "core:video", name: "core:video", media: { src: "/x.mp4" } }
          : { type: nodeType, name: nodeType }
  ) as NodeRecord,
  style: {},
  styleUi: undefined,
  target: { cssState: "default" },
  setStyle: () => undefined,
  patchStyle: () => undefined,
  setStyleUi: () => undefined,
});

describe("style inspector resolver", () => {
  const registry = createBootstrappedEditorRegistry();

  it("returns no sections for root node", () => {
    const sections = resolveStyleSectionsForNode({
      ctx: makeCtx("core:root"),
      registry,
    });
    expect(sections.map((section) => section.id)).toEqual([]);
  });

  it("resolves text sections including typography and excluding media fitting", () => {
    const sections = resolveStyleSectionsForNode({
      ctx: makeCtx("core:text"),
      registry,
    });
    const sectionIds = sections.map((section) => section.id);

    expect(sectionIds).toContain("typography");
    expect(sectionIds).not.toContain("media-fitting");
  });

  it("resolves media sections including media fitting and excluding typography", () => {
    const sections = resolveStyleSectionsForNode({
      ctx: makeCtx("core:image"),
      registry,
    });
    const sectionIds = sections.map((section) => section.id);

    expect(sectionIds).toContain("media-fitting");
    expect(sectionIds).not.toContain("typography");
  });

  it("follows node style section order from the node definition", () => {
    const expected = registry.getNodeType("core:text")?.styles?.sectionIds || [];
    const sections = resolveStyleSectionsForNode({
      ctx: makeCtx("core:text"),
      registry,
    });
    const sectionIds = sections.map((section) => section.id);

    expect(sectionIds).toEqual(expected);
  });
});
