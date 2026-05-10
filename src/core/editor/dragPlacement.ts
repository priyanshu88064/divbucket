import type { EditorPlacement } from "./types";

export interface PlacementResolution {
  placement: EditorPlacement;
  indicator: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

interface RectLike {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const resolveCanvasPlacement = ({
  x,
  y,
  rect,
  canDropInside,
  hideInsideIndicator = false,
}: {
  x: number;
  y: number;
  rect: RectLike;
  canDropInside: boolean;
  hideInsideIndicator?: boolean;
}): PlacementResolution => {
  const xOffset = x - rect.left;
  const yOffset = y - rect.top;

  let xZone = 0;
  let yZone = 0;

  if (xOffset > (rect.width * 20) / 100) xZone = 1;
  if (xOffset > (rect.width * 80) / 100) xZone = 2;
  if (yOffset > (rect.height * 20) / 100) yZone = 1;
  if (yOffset > (rect.height * 80) / 100) yZone = 2;

  if (xZone === 1 && yZone === 1 && canDropInside) {
    return {
      placement: "inside",
      indicator: hideInsideIndicator
        ? null
        : {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
    };
  }

  if (yZone === 0 || xZone === 0) {
    return {
      placement: "before",
      indicator:
        yZone === 0
          ? {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: 4,
            }
          : {
              top: rect.top,
              left: rect.left,
              width: 4,
              height: rect.height,
            },
    };
  }

  return {
    placement: "after",
    indicator:
      yZone === 2
        ? {
            top: rect.top + rect.height,
            left: rect.left,
            width: rect.width,
            height: 4,
          }
        : {
            top: rect.top,
            left: rect.left + rect.width,
            width: 4,
            height: rect.height,
          },
  };
};

export const resolveExplorerPlacement = ({
  y,
  rect,
  canDropInside,
}: {
  y: number;
  rect: RectLike;
  canDropInside: boolean;
}): EditorPlacement => {
  const deltaY = y - rect.top;
  if (deltaY <= rect.height / 3) return "before";
  if (canDropInside && deltaY <= (rect.height * 2) / 3) return "inside";
  return "after";
};
