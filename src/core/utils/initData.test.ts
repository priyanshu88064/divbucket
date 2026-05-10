import { describe, expect, it } from "vitest";
import initData from "./initData";
import { editorRegistry } from "@core/kernel/bootstrap";

describe("initData", () => {
  it("creates records from the bootstrapped registry definition", () => {
    const expected = editorRegistry.getNodeType("core:container")?.createRecord();
    expect(expected).toBeDefined();
    expect(initData("core:container")).toEqual(expected);
  });

  it("throws for unknown node kind", () => {
    expect(() => initData("missing" as never)).toThrow(/Missing node definition/);
  });
});
