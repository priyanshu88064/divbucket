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
    setDragState({ isDragging: false, indicator: null });
    const second = getDragStateSnapshot();
    expect(second).toBe(first);
  });

  it("updates snapshot for changed drag indicator", () => {
    const first = getDragStateSnapshot();
    setDragState({
      isDragging: true,
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
    expect(second.indicator?.placement).toBe("before");
  });
});
