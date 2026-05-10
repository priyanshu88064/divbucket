import { beforeEach, describe, expect, it } from "vitest";
import {
  clearDragState,
  getDragStateSnapshot,
  setDragState,
} from "./useDragState";

describe("useDragState store", () => {
  beforeEach(() => {
    clearDragState();
  });

  it("does not replace snapshot when update payload is unchanged", () => {
    const first = getDragStateSnapshot();
    setDragState({
      isDragging: false,
      source: null,
      ghost: null,
      pointer: null,
      target: null,
      indicator: null,
    });
    const second = getDragStateSnapshot();
    expect(second).toBe(first);
  });

  it("updates snapshot for changed drag indicator", () => {
    const first = getDragStateSnapshot();
    setDragState({
      isDragging: true,
      source: {
        kind: "palette",
        templateType: "core:container",
        label: "Div",
      },
      ghost: {
        label: "Div",
        x: 12,
        y: 16,
      },
      pointer: {
        x: 12,
        y: 16,
      },
      target: {
        targetId: 42,
        placement: "before",
      },
      indicator: {
        top: 10,
        left: 20,
        width: 100,
        height: 2,
        placement: "before",
      },
    });

    const second = getDragStateSnapshot();
    expect(second).not.toBe(first);
    expect(second.isDragging).toBe(true);
    expect(second.source?.kind).toBe("palette");
    expect(second.target?.targetId).toBe(42);
    expect(second.indicator?.placement).toBe("before");
  });
});
