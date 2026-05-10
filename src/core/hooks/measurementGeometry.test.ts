import { describe, expect, it } from "vitest";
import {
  pointFromParentToSurface,
  pointFromSurfaceToParent,
  rectFromViewport,
} from "./measurementGeometry";

describe("measurementGeometry", () => {
  it("translates iframe-local rect into parent viewport coordinates", () => {
    const translated = rectFromViewport({
      surfaceRect: { top: 50, left: 100 },
      localRect: { top: 20, left: 30, width: 200, height: 40 },
    });

    expect(translated).toEqual({
      top: 70,
      left: 130,
      width: 200,
      height: 40,
    });
  });

  it("translates parent point into iframe viewport point", () => {
    const translated = pointFromParentToSurface({
      parentPoint: { x: 340, y: 290 },
      surfaceRect: { top: 100, left: 200 },
    });
    expect(translated).toEqual({ x: 140, y: 190 });
  });

  it("translates iframe viewport point back into parent viewport point", () => {
    const translated = pointFromSurfaceToParent({
      surfacePoint: { x: 140, y: 190 },
      surfaceRect: { top: 100, left: 200 },
    });
    expect(translated).toEqual({ x: 340, y: 290 });
  });
});
