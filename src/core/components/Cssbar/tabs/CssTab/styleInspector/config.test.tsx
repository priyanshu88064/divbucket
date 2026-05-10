import { describe, expect, it } from "vitest";
import { STYLE_SECTIONS } from "./config";
describe("style inspector config structure", () => {
  it("keeps section ids unique", () => {
    const sectionIds = STYLE_SECTIONS.map((section) => section.id);
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
  });

  it("includes all core built-in sections", () => {
    expect(STYLE_SECTIONS.map((section) => section.id)).toEqual([
      "layout",
      "spacing",
      "appearance",
      "typography",
      "border",
      "position",
      "overflow",
      "effects",
      "transform",
      "transition",
      "cursor",
      "media-fitting",
    ]);
  });

  it("defines media fitting with object-fit and object-position fields", () => {
    const mediaSection = STYLE_SECTIONS.find(
      (section) => section.id === "media-fitting",
    );
    expect(mediaSection).toBeDefined();
    expect(mediaSection?.fields.map((field) => field.id)).toEqual([
      "object-fit",
      "object-position",
    ]);
  });
});
