export interface RectLike {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PointLike {
  x: number;
  y: number;
}

export const rectFromViewport = ({
  surfaceRect,
  localRect,
}: {
  surfaceRect: Pick<RectLike, "top" | "left">;
  localRect: RectLike;
}): RectLike => ({
  top: surfaceRect.top + localRect.top,
  left: surfaceRect.left + localRect.left,
  width: localRect.width,
  height: localRect.height,
});

export const pointFromParentToSurface = ({
  parentPoint,
  surfaceRect,
}: {
  parentPoint: PointLike;
  surfaceRect: Pick<RectLike, "top" | "left">;
}): PointLike => ({
  x: parentPoint.x - surfaceRect.left,
  y: parentPoint.y - surfaceRect.top,
});

export const pointFromSurfaceToParent = ({
  surfacePoint,
  surfaceRect,
}: {
  surfacePoint: PointLike;
  surfaceRect: Pick<RectLike, "top" | "left">;
}): PointLike => ({
  x: surfaceRect.left + surfacePoint.x,
  y: surfaceRect.top + surfacePoint.y,
});
