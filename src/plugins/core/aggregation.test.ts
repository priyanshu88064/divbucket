import { describe, expect, it } from "vitest";
import { CORE_RUNTIME_NODE_KINDS } from "./nodes";
import { CORE_PRESET_IDS } from "./presets";
import { CORE_STYLE_SECTIONS, STYLE_SECTIONS } from "./styles";
import { STYLE_SECTIONS as STYLE_SECTIONS_FROM_UI_CONFIG } from "@core/components/Cssbar/tabs/CssTab/styleInspector/config";

describe("core plugin aggregation", () => {
  it("includes every built-in node folder definition in the aggregate", () => {
    expect(CORE_RUNTIME_NODE_KINDS).toEqual([
      "core:root",
      "core:container",
      "core:row",
      "core:heading",
      "core:text",
      "core:paragraph",
      "core:button",
      "custom:input",
      "custom:divider",
      "core:image",
      "core:video",
      "core:list",
      "core:listItem",
    ]);
  });

  it("includes every built-in preset folder definition in the aggregate", () => {
    expect(CORE_PRESET_IDS).toContain("core:page");
    expect(CORE_PRESET_IDS).toContain("core:container");
    expect(CORE_PRESET_IDS).toContain("core:row");
    expect(CORE_PRESET_IDS).toContain("core:heading");
    expect(CORE_PRESET_IDS).toContain("core:text");
    expect(CORE_PRESET_IDS).toContain("core:paragraph");
    expect(CORE_PRESET_IDS).toContain("core:image");
    expect(CORE_PRESET_IDS).toContain("core:video");
    expect(CORE_PRESET_IDS).toContain("core:button");
    expect(CORE_PRESET_IDS).toContain("core:list");
    expect(CORE_PRESET_IDS).toContain("core:listItem");
    expect(CORE_PRESET_IDS).toContain("core:navbar");
    expect(CORE_PRESET_IDS).toContain("core:hero");
    expect(CORE_PRESET_IDS).toContain("core:feature");
    expect(CORE_PRESET_IDS).toContain("core:card");
    expect(CORE_PRESET_IDS).toContain("custom:vFlex");
    expect(CORE_PRESET_IDS).toContain("custom:contactForm");
    expect(CORE_PRESET_IDS).toContain("custom:bentoGrid");
  });

  it("includes every built-in style section folder definition in the aggregate", () => {
    expect(CORE_STYLE_SECTIONS.map((section) => section.id)).toEqual([
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

  it("sources style sections from built-in style modules, not component-local config", () => {
    expect(STYLE_SECTIONS_FROM_UI_CONFIG).toBe(STYLE_SECTIONS);
    expect(STYLE_SECTIONS).toBe(CORE_STYLE_SECTIONS);
  });
});
