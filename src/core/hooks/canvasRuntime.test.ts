import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { IFRAME_SURFACE_ID, LEGACY_SURFACE_ID } from "@core/types/canvas";
import { registerMeasurementSurface } from "./useNodeMeasurements";
import { getCanvasKeyboardTargets, isCanvasOwnedTarget } from "./canvasRuntime";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalNode = (globalThis as { Node?: typeof Node }).Node;

class FakeNode {
  ownerDocument: Document | null;

  constructor(ownerDocument: Document | null) {
    this.ownerDocument = ownerDocument;
  }
}

describe("canvasRuntime helpers", () => {
  beforeEach(() => {
    (globalThis as { window?: Window }).window = {
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Window;
    (globalThis as { document?: Document }).document = {} as Document;
    (globalThis as { Node?: typeof Node }).Node = FakeNode as unknown as typeof Node;
  });

  afterEach(() => {
    registerMeasurementSurface(LEGACY_SURFACE_ID, null);
    registerMeasurementSurface(IFRAME_SURFACE_ID, null);
    if (originalWindow) {
      (globalThis as { window?: Window }).window = originalWindow;
    } else {
      delete (globalThis as { window?: Window }).window;
    }
    if (originalDocument) {
      (globalThis as { document?: Document }).document = originalDocument;
    } else {
      delete (globalThis as { document?: Document }).document;
    }
    if (originalNode) {
      (globalThis as { Node?: typeof Node }).Node = originalNode;
    } else {
      delete (globalThis as { Node?: typeof Node }).Node;
    }
  });

  it("returns deduplicated keyboard targets for the active canvas mode", () => {
    registerMeasurementSurface(LEGACY_SURFACE_ID, {
      id: LEGACY_SURFACE_ID,
      kind: "legacy",
      viewportElement: null,
      scrollElement: null,
    });

    const iframeDocument = {
      name: "iframe-document",
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Document;
    const iframeWindow = {
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollX: 0,
      scrollY: 0,
    } as unknown as Window;
    registerMeasurementSurface(IFRAME_SURFACE_ID, {
      id: IFRAME_SURFACE_ID,
      kind: "iframe",
      iframeElement: null,
      contentDocument: iframeDocument,
      contentWindow: iframeWindow,
    });

    const legacyTargets = getCanvasKeyboardTargets({ canvasMode: "legacy" });
    expect(legacyTargets).toContain(globalThis.window as unknown as Window);
    expect(legacyTargets).toContain(globalThis.document as unknown as Document);

    const iframeTargets = getCanvasKeyboardTargets({ canvasMode: "iframe" });
    expect(iframeTargets).toContain(globalThis.window as unknown as Window);
    expect(iframeTargets).toContain(globalThis.document as unknown as Document);
    expect(iframeTargets).toContain(iframeWindow);
    expect(iframeTargets).toContain(iframeDocument);
  });

  it("detects whether an event target belongs to any registered canvas surface", () => {
    registerMeasurementSurface(LEGACY_SURFACE_ID, {
      id: LEGACY_SURFACE_ID,
      kind: "legacy",
      viewportElement: null,
      scrollElement: null,
    });

    const documentTarget = new FakeNode(
      globalThis.document as unknown as Document,
    ) as unknown as EventTarget;
    expect(isCanvasOwnedTarget(documentTarget)).toBe(true);

    const otherDocument = {
      name: "other-document",
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as Document;
    const otherTarget = new FakeNode(otherDocument) as unknown as EventTarget;
    expect(isCanvasOwnedTarget(otherTarget)).toBe(false);

    registerMeasurementSurface(IFRAME_SURFACE_ID, {
      id: IFRAME_SURFACE_ID,
      kind: "iframe",
      iframeElement: null,
      contentDocument: otherDocument,
      contentWindow: null,
    });
    expect(isCanvasOwnedTarget(otherTarget)).toBe(true);
  });
});
