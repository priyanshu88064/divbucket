import { describe, expect, it } from "vitest";
import {
  resolveCanvasPlacement,
  resolveExplorerPlacement,
} from "./dragPlacement";

const rect = {
  top: 100,
  left: 200,
  width: 300,
  height: 120,
};

describe("dragPlacement", () => {
  it("resolves canvas inside for center area of container node", () => {
    const result = resolveCanvasPlacement({
      x: 320,
      y: 160,
      rect,
      canDropInside: true,
    });

    expect(result.placement).toBe("inside");
    expect(result.indicator).toEqual({
      top: 100,
      left: 200,
      width: 300,
      height: 120,
    });
  });

  it("resolves canvas before at top edge", () => {
    const result = resolveCanvasPlacement({
      x: 320,
      y: 105,
      rect,
      canDropInside: false,
    });

    expect(result.placement).toBe("before");
    expect(result.indicator?.height).toBe(4);
  });

  it("resolves canvas after at bottom edge", () => {
    const result = resolveCanvasPlacement({
      x: 320,
      y: 218,
      rect,
      canDropInside: false,
    });

    expect(result.placement).toBe("after");
    expect(result.indicator?.top).toBe(rect.top + rect.height);
  });

  it("supports inside without indicator for root-like targets", () => {
    const result = resolveCanvasPlacement({
      x: 320,
      y: 160,
      rect,
      canDropInside: true,
      hideInsideIndicator: true,
    });

    expect(result.placement).toBe("inside");
    expect(result.indicator).toBeNull();
  });

  it("denies inside placement when metadata says target cannot accept children", () => {
    const result = resolveCanvasPlacement({
      x: 320,
      y: 160,
      rect,
      canDropInside: false,
    });

    expect(result.placement).toBe("after");
  });

  it("resolves explorer placement using top/middle/bottom zones", () => {
    expect(
      resolveExplorerPlacement({ y: 110, rect, canDropInside: true }),
    ).toBe("before");
    expect(
      resolveExplorerPlacement({ y: 150, rect, canDropInside: true }),
    ).toBe("inside");
    expect(
      resolveExplorerPlacement({ y: 210, rect, canDropInside: true }),
    ).toBe("after");
  });
});
