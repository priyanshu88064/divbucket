import { describe, expect, it, vi } from "vitest";
import {
  attachCanvasKeyboardListeners,
  clearCanvasFocus,
  detectCanvasViewportPreset,
  getCanvasFocusStateSnapshot,
  isEditableEventTarget,
  resolveEffectiveViewportWidth,
  setCanvasFocused,
  shouldHandleCanvasShortcut,
} from "./canvasSession";

describe("canvasSession helpers", () => {
  it("stores and clears canvas focus in session state", () => {
    clearCanvasFocus();
    setCanvasFocused("iframe-canvas");
    expect(getCanvasFocusStateSnapshot()).toEqual({
      isCanvasFocused: true,
      focusedSurfaceId: "iframe-canvas",
    });

    clearCanvasFocus();
    expect(getCanvasFocusStateSnapshot()).toEqual({
      isCanvasFocused: false,
      focusedSurfaceId: null,
    });
  });

  it("detects editable targets", () => {
    expect(isEditableEventTarget(null)).toBe(false);
    expect(isEditableEventTarget({} as EventTarget)).toBe(false);
  });

  it("attaches keyboard listeners to provided targets and cleans up", () => {
    const target = new EventTarget();
    const addSpy = vi.spyOn(target, "addEventListener");
    const removeSpy = vi.spyOn(target, "removeEventListener");

    const cleanup = attachCanvasKeyboardListeners({
      targets: [target as unknown as Document],
      onKeyDown: () => {},
      onKeyUp: () => {},
    });
    expect(addSpy).toHaveBeenCalledTimes(2);
    cleanup();
    expect(removeSpy).toHaveBeenCalledTimes(2);
  });

  it("resolves viewport preset and effective width with clamping", () => {
    expect(detectCanvasViewportPreset("425px")).toBe("mobile");
    expect(detectCanvasViewportPreset("768px")).toBe("tablet");
    expect(detectCanvasViewportPreset("100%")).toBe("desktop");
    expect(detectCanvasViewportPreset("640px")).toBe("custom");

    expect(
      resolveEffectiveViewportWidth({
        requestedWidth: "425px",
        availableWidth: 500,
      }),
    ).toBe(425);
    expect(
      resolveEffectiveViewportWidth({
        requestedWidth: "768px",
        availableWidth: 600,
      }),
    ).toBe(600);
    expect(
      resolveEffectiveViewportWidth({
        requestedWidth: "100%",
        availableWidth: 999,
      }),
    ).toBe(999);
  });

  it("gates canvas shortcuts by focus and key combinations", () => {
    const event = {
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      key: "c",
      target: {} as EventTarget,
    } as Pick<
      KeyboardEvent,
      "ctrlKey" | "metaKey" | "shiftKey" | "key" | "target"
    >;
    expect(
      shouldHandleCanvasShortcut({
        isCanvasFocused: true,
        event,
      }),
    ).toBe(true);
    expect(
      shouldHandleCanvasShortcut({
        isCanvasFocused: false,
        event,
      }),
    ).toBe(false);

    expect(
      shouldHandleCanvasShortcut({
        isCanvasFocused: true,
        event: { ...event, key: "z" },
      }),
    ).toBe(true);
    expect(
      shouldHandleCanvasShortcut({
        isCanvasFocused: true,
        event: { ...event, key: "y" },
      }),
    ).toBe(true);
  });
});
