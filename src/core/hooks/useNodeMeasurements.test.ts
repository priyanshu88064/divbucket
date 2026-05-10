import { describe, expect, it } from "vitest";
import { IFRAME_SURFACE_ID, LEGACY_SURFACE_ID } from "@core/types/canvas";
import {
  getSurfaceElementFromPoint,
  getSurfaceViewportRect,
  getSurfaceViewportScroll,
  registerMeasurementSurface,
  translateParentPointToSurfaceViewport,
  translateSurfacePointToParentViewport,
  translateSurfaceRectToParentViewport,
} from "./useNodeMeasurements";

describe("useNodeMeasurements helpers", () => {
  it("translates iframe geometry to parent viewport coordinates", () => {
    const iframeElement = {
      getBoundingClientRect: () =>
        ({
          top: 80,
          left: 120,
          width: 500,
          height: 320,
        }) as DOMRect,
    } as HTMLIFrameElement;

    registerMeasurementSurface(IFRAME_SURFACE_ID, {
      id: IFRAME_SURFACE_ID,
      kind: "iframe",
      iframeElement,
      contentWindow: null,
      contentDocument: null,
    });

    const translatedRect = translateSurfaceRectToParentViewport({
      surfaceId: IFRAME_SURFACE_ID,
      rect: {
        top: 10,
        left: 40,
        width: 50,
        height: 20,
      },
    });
    expect(translatedRect).toEqual({
      top: 90,
      left: 160,
      width: 50,
      height: 20,
    });

    const toSurface = translateParentPointToSurfaceViewport({
      surfaceId: IFRAME_SURFACE_ID,
      point: { x: 260, y: 280 },
    });
    expect(toSurface).toEqual({ x: 140, y: 200 });

    const toParent = translateSurfacePointToParentViewport({
      surfaceId: IFRAME_SURFACE_ID,
      point: { x: 140, y: 200 },
    });
    expect(toParent).toEqual({ x: 260, y: 280 });
  });

  it("returns null when parent point falls outside iframe bounds", () => {
    const iframeElement = {
      getBoundingClientRect: () =>
        ({
          top: 80,
          left: 120,
          width: 200,
          height: 100,
        }) as DOMRect,
    } as HTMLIFrameElement;
    const contentDocument = {
      elementFromPoint: () => ({}) as Element,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Document;

    registerMeasurementSurface(IFRAME_SURFACE_ID, {
      id: IFRAME_SURFACE_ID,
      kind: "iframe",
      iframeElement,
      contentWindow: null,
      contentDocument,
    });

    const hit = getSurfaceElementFromPoint({
      surfaceId: IFRAME_SURFACE_ID,
      parentPoint: { x: 10, y: 10 },
    });
    expect(hit).toBeNull();
  });

  it("exposes iframe viewport rect and scroll position", () => {
    const iframeElement = {
      getBoundingClientRect: () =>
        ({
          top: 5,
          left: 10,
          width: 200,
          height: 300,
        }) as DOMRect,
    } as HTMLIFrameElement;
    const contentWindow = {
      scrollX: 12,
      scrollY: 34,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Window;
    const contentDocument = {
      addEventListener: () => {},
      removeEventListener: () => {},
      elementFromPoint: () => null,
    } as unknown as Document;

    registerMeasurementSurface(IFRAME_SURFACE_ID, {
      id: IFRAME_SURFACE_ID,
      kind: "iframe",
      iframeElement,
      contentWindow,
      contentDocument,
    });

    expect(getSurfaceViewportRect(IFRAME_SURFACE_ID)).toMatchObject({
      top: 5,
      left: 10,
      width: 200,
      height: 300,
    });
    expect(getSurfaceViewportScroll(IFRAME_SURFACE_ID)).toEqual({
      x: 12,
      y: 34,
    });
  });

  it("keeps legacy translation as pass-through", () => {
    registerMeasurementSurface(LEGACY_SURFACE_ID, {
      id: LEGACY_SURFACE_ID,
      kind: "legacy",
      viewportElement: null,
      scrollElement: null,
    });

    const translated = translateParentPointToSurfaceViewport({
      surfaceId: LEGACY_SURFACE_ID,
      point: { x: 25, y: 35 },
    });
    expect(translated).toEqual({ x: 25, y: 35 });
  });
});
