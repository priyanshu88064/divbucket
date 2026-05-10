import { describe, expect, it } from "vitest";
import initCSS from "./initCSS";
import { editorRegistry } from "@core/kernel/bootstrap";

describe("initCSS", () => {
  it("creates styles from the bootstrapped registry definition", () => {
    const expected = editorRegistry.getNodeType("core:row")?.createStyle();
    expect(expected).toBeDefined();
    expect(initCSS("core:row")).toEqual(expected);
  });

  it("throws for unknown node kind", () => {
    expect(() => initCSS("missing" as never)).toThrow(/Missing node definition/);
  });
});
