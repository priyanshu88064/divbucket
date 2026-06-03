import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@core/state/store";
import { createTemplate, instantiateTemplate } from "@core/utils/template";
import { editorRegistry } from "@core/kernel/bootstrap";
import { moveNode, updateDataMap } from "@core/state/reducers/treeReducer";
import { resolveCanvasPlacement } from "@core/editor/dragPlacement";
import { canPlaceChildKindAtTarget } from "@core/editor/constraints";
import { clearDragState, setDragState } from "./useDragState";
import type { NodeKind, NodeRecord, PresetId } from "@core/types/document";
import {
  selectActivePageId,
  selectDocumentState,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "./useRenderCounter";
import { resolveCanvasMode } from "@core/types/canvas";
import { IFRAME_SURFACE_ID, LEGACY_SURFACE_ID } from "@core/types/canvas";
import {
  getSurfaceElementFromPoint,
  getSurfaceWindow,
  translateParentPointToSurfaceViewport,
  translateSurfacePointToParentViewport,
  translateSurfaceRectToParentViewport,
} from "./useNodeMeasurements";
import { setCanvasFocused } from "./canvasSession";

interface DragPointerPoint {
  x: number;
  y: number;
}

type RuntimeSource =
  | {
      kind: "node";
      nodeId: number;
      label: string;
      draggedKind: NodeKind | null;
    }
  | {
      kind: "palette";
      templateType: string;
      label: string;
      draggedKind: NodeKind | null;
      iconPayload: {
        iconId: string;
        iconLabel?: string;
      } | null;
    };

interface DragRuntimeState {
  source: RuntimeSource;
}

interface DragSessionListeners {
  parentMove: (event: MouseEvent) => void;
  parentUp: (event: MouseEvent) => void;
  iframeMove: ((event: MouseEvent) => void) | null;
  iframeUp: ((event: MouseEvent) => void) | null;
  iframeWindow: Window | null;
}

const DRAG_START_DISTANCE_PX = 5;

export function useDrag() {
  useRenderCounter("useDrag");
  const dispatch = useDispatch<AppDispatch>();
  const treeState = useSelector(selectDocumentState);
  const activePageId = useSelector(selectActivePageId);
  const dragRuntimeRef = useRef<DragRuntimeState | null>(null);
  const sessionListenersRef = useRef<DragSessionListeners | null>(null);

  const resolveDraggedKindForTemplate = (templateType: string) => {
    const nodeDefinition = editorRegistry.getNodeType(templateType as NodeKind);
    if (nodeDefinition) return templateType as NodeKind;

    try {
      const template = instantiateTemplate({
        type: templateType as PresetId,
        treeState,
        registry: editorRegistry,
      });
      return template.nodeRecordMap[template.rootId]?.type || null;
    } catch {
      return null;
    }
  };

  const resolveRuntimeSource = (
    target: EventTarget | null,
  ): RuntimeSource | null => {
    if (!(target instanceof Element)) return null;

    const paletteSource = target.closest(
      "[data-canvas-drag-source='palette'][data-canvas-template-type]",
    ) as HTMLElement | null;
    if (paletteSource) {
      const templateType = paletteSource.dataset.canvasTemplateType;
      if (!templateType) return null;
      const iconId = paletteSource.dataset.canvasIconId;
      const iconLabel = paletteSource.dataset.canvasIconLabel;
      return {
        kind: "palette",
        templateType,
        label: (paletteSource.textContent || templateType).trim(),
        draggedKind: resolveDraggedKindForTemplate(templateType),
        iconPayload: iconId ? { iconId, iconLabel } : null,
      };
    }

    const nodeSource = target.closest(
      "[data-canvas-drag-source='node'][data-canvas-node-id]",
    ) as HTMLElement | null;
    if (nodeSource) {
      const rawNodeId = nodeSource.dataset.canvasNodeId;
      if (!rawNodeId) return null;
      const nodeId = Number(rawNodeId);
      const nodeRecord = treeState.nodeRecordMap[nodeId];
      if (!nodeRecord) return null;
      return {
        kind: "node",
        nodeId,
        label: (nodeSource.textContent || nodeRecord.name || nodeRecord.type).trim(),
        draggedKind: nodeRecord.type,
      };
    }

    return null;
  };

  const getCanvasSurfaceId = () =>
    resolveCanvasMode() === "iframe" ? IFRAME_SURFACE_ID : LEGACY_SURFACE_ID;

  const patchCreatedRecordFromSource = ({
    source,
    record,
  }: {
    source: Extract<RuntimeSource, { kind: "palette" }>;
    record: NodeRecord;
  }): NodeRecord => {
    if (!source.iconPayload || record.type !== "custom:icon") {
      return record;
    }

    const previousPayload =
      record.payload && typeof record.payload === "object"
        ? record.payload
        : {};

    return {
      ...record,
      name: source.iconPayload.iconLabel || source.label || record.name,
      payload: {
        ...previousPayload,
        iconId: source.iconPayload.iconId,
      },
    };
  };

  const resolveTargetAtPoint = ({
    pointer,
    source,
  }: {
    pointer: DragPointerPoint;
    source: RuntimeSource;
  }) => {
    const draggedKind = source.draggedKind;
    if (!draggedKind) return null;

    const canvasSurfaceId = getCanvasSurfaceId();
    const surfaceElement = getSurfaceElementFromPoint({
      surfaceId: canvasSurfaceId,
      parentPoint: pointer,
    });
    const targetElement = surfaceElement?.closest(
      "[data-id][data-type]",
    ) as HTMLElement | null;
    const targetId = targetElement?.getAttribute("data-id");
    const targetType = targetElement?.getAttribute("data-type") as NodeKind | null;
    const draggedNodeId = source.kind === "node" ? source.nodeId : null;

    const resolveFallbackRootTarget = () => {
      if (activePageId === null) return null;
      if (draggedNodeId !== null && draggedNodeId === activePageId) return null;

      const isLegacySurface = canvasSurfaceId === LEGACY_SURFACE_ID;
      if (
        isLegacySurface &&
        (!surfaceElement ||
          !(surfaceElement instanceof HTMLElement) ||
          !surfaceElement.closest("#playground"))
      ) {
        return null;
      }
      if (!isLegacySurface && !surfaceElement) return null;

      const canDropInsideActivePage = canPlaceChildKindAtTarget({
        state: treeState,
        childKind: draggedKind,
        target: {
          referenceNodeId: activePageId,
          placement: "inside",
        },
      });
      if (!canDropInsideActivePage) return null;

      return {
        target: {
          targetId: activePageId,
          placement: "inside" as const,
        },
        indicator: null,
      };
    };

    if (
      !targetElement ||
      !targetId ||
      !targetType ||
      (draggedNodeId !== null && draggedNodeId === Number(targetId))
    ) {
      return resolveFallbackRootTarget();
    }

    const targetRect = targetElement.getBoundingClientRect();
    const localPointer = translateParentPointToSurfaceViewport({
      surfaceId: canvasSurfaceId,
      point: pointer,
    });
    const referenceNodeId = Number(targetId);
    const canDropInside = canPlaceChildKindAtTarget({
      state: treeState,
      childKind: draggedKind,
      target: {
        referenceNodeId,
        placement: "inside",
      },
    });

    const resolved = resolveCanvasPlacement({
      x: localPointer.x,
      y: localPointer.y,
      rect: targetRect,
      canDropInside,
      hideInsideIndicator: targetType === "core:root",
    });

    const canPlaceAtResolvedTarget = canPlaceChildKindAtTarget({
      state: treeState,
      childKind: draggedKind,
      target: {
        referenceNodeId,
        placement: resolved.placement,
      },
    });
    if (!canPlaceAtResolvedTarget) {
      return resolveFallbackRootTarget();
    }

    const translatedIndicator = resolved.indicator
      ? translateSurfaceRectToParentViewport({
          surfaceId: canvasSurfaceId,
          rect: resolved.indicator,
        })
      : null;

    return {
      target: {
        targetId: referenceNodeId,
        placement: resolved.placement,
      },
      indicator: translatedIndicator
        ? {
            ...translatedIndicator,
            placement: resolved.placement,
          }
        : null,
    };
  };

  const updateDragPointer = ({
    pointer,
    source,
  }: {
    pointer: DragPointerPoint;
    source: RuntimeSource;
  }) => {
    const resolvedTarget = resolveTargetAtPoint({
      pointer,
      source,
    });
    setDragState({
      isDragging: true,
      source:
        source.kind === "node"
          ? {
              kind: "node",
              nodeId: source.nodeId,
              label: source.label,
            }
          : {
              kind: "palette",
              templateType: source.templateType,
              label: source.label,
            },
      pointer,
      ghost: {
        label: source.label,
        x: pointer.x,
        y: pointer.y,
      },
      target: resolvedTarget?.target || null,
      indicator: resolvedTarget?.indicator || null,
    });
  };

  const cleanupListeners = () => {
    const listeners = sessionListenersRef.current;
    if (!listeners) return;
    window.removeEventListener("mousemove", listeners.parentMove);
    window.removeEventListener("mouseup", listeners.parentUp);
    if (
      listeners.iframeWindow &&
      listeners.iframeWindow !== window &&
      listeners.iframeMove &&
      listeners.iframeUp
    ) {
      listeners.iframeWindow.removeEventListener(
        "mousemove",
        listeners.iframeMove,
      );
      listeners.iframeWindow.removeEventListener("mouseup", listeners.iframeUp);
    }
    sessionListenersRef.current = null;
  };

  const cleanupDragSession = () => {
    cleanupListeners();
    dragRuntimeRef.current = null;
    clearDragState();
  };

  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (dragRuntimeRef.current) cleanupDragSession();
    const source = resolveRuntimeSource(e.target);
    if (!source) return;

    e.preventDefault();
    e.stopPropagation();

    dragRuntimeRef.current = {
      source,
    };

    const startPoint = { x: e.clientX, y: e.clientY };
    let hasStartedDrag = false;

    const hasCrossedDragThreshold = (point: DragPointerPoint) => {
      const deltaX = point.x - startPoint.x;
      const deltaY = point.y - startPoint.y;
      return Math.hypot(deltaX, deltaY) >= DRAG_START_DISTANCE_PX;
    };

    const startDragIfNeeded = ({
      pointer,
      runtime,
    }: {
      pointer: DragPointerPoint;
      runtime: DragRuntimeState;
    }) => {
      if (hasStartedDrag || !hasCrossedDragThreshold(pointer)) {
        return;
      }

      hasStartedDrag = true;
      setCanvasFocused(getCanvasSurfaceId());
      updateDragPointer({
        pointer,
        source: runtime.source,
      });
    };

    const handleMove = (event: MouseEvent) => {
      const runtime = dragRuntimeRef.current;
      if (!runtime) return;
      if ((event.buttons & 1) !== 1) {
        cleanupDragSession();
        return;
      }
      const pointer = { x: event.clientX, y: event.clientY };
      startDragIfNeeded({
        pointer,
        runtime,
      });
      if (!hasStartedDrag) return;
      updateDragPointer({
        pointer,
        source: runtime.source,
      });
    };
    const handleMoveFromIframe = (event: MouseEvent) => {
      const runtime = dragRuntimeRef.current;
      if (!runtime) return;
      if ((event.buttons & 1) !== 1) {
        cleanupDragSession();
        return;
      }
      const parentPoint = translateSurfacePointToParentViewport({
        surfaceId: IFRAME_SURFACE_ID,
        point: {
          x: event.clientX,
          y: event.clientY,
        },
      });
      startDragIfNeeded({
        pointer: parentPoint,
        runtime,
      });
      if (!hasStartedDrag) return;
      updateDragPointer({
        pointer: parentPoint,
        source: runtime.source,
      });
    };
    const commitDrop = (parentPoint: DragPointerPoint) => {
      const runtime = dragRuntimeRef.current;
      if (!runtime) {
        cleanupDragSession();
        return;
      }
      const target = resolveTargetAtPoint({
        pointer: parentPoint,
        source: runtime.source,
      });
      if (!target) {
        cleanupDragSession();
        return;
      }

      if (runtime.source.kind === "node") {
        dispatch(
          moveNode({
            node: runtime.source.nodeId,
            target: {
              referenceNodeId: target.target.targetId,
              placement: target.target.placement,
            },
          }),
        );
        cleanupDragSession();
        return;
      }

      const createdNodeId = createTemplate({
        type: runtime.source.templateType,
        dispatch,
        treeState,
        registry: editorRegistry,
      });
      if (runtime.source.iconPayload) {
        const createdNodeDefinition = editorRegistry.getNodeType("custom:icon");
        if (createdNodeDefinition) {
          const createdRecord = createdNodeDefinition.createRecord();
          const patchedRecord = patchCreatedRecordFromSource({
            source: runtime.source,
            record: createdRecord,
          });
          dispatch(
            updateDataMap({
              id: createdNodeId,
              data: patchedRecord,
            }),
          );
        }
      }
      if (createdNodeId !== target.target.targetId) {
        dispatch(
          moveNode({
            node: createdNodeId,
            target: {
              referenceNodeId: target.target.targetId,
              placement: target.target.placement,
            },
          }),
        );
      }
      cleanupDragSession();
    };
    const handleUp = (event: MouseEvent) => {
      if (!hasStartedDrag) {
        cleanupDragSession();
        return;
      }
      event.preventDefault();
      commitDrop({
        x: event.clientX,
        y: event.clientY,
      });
    };
    const handleUpFromIframe = (event: MouseEvent) => {
      if (!hasStartedDrag) {
        cleanupDragSession();
        return;
      }
      const parentPoint = translateSurfacePointToParentViewport({
        surfaceId: IFRAME_SURFACE_ID,
        point: {
          x: event.clientX,
          y: event.clientY,
        },
      });
      event.preventDefault();
      commitDrop({
        x: parentPoint.x,
        y: parentPoint.y,
      });
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    const iframeWindow = getSurfaceWindow(IFRAME_SURFACE_ID);
    let iframeMove: ((event: MouseEvent) => void) | null = null;
    let iframeUp: ((event: MouseEvent) => void) | null = null;
    if (iframeWindow && iframeWindow !== window) {
      iframeMove = handleMoveFromIframe;
      iframeUp = handleUpFromIframe;
      iframeWindow.addEventListener("mousemove", handleMoveFromIframe);
      iframeWindow.addEventListener("mouseup", handleUpFromIframe);
    }
    sessionListenersRef.current = {
      parentMove: handleMove,
      parentUp: handleUp,
      iframeMove,
      iframeUp,
      iframeWindow: iframeWindow && iframeWindow !== window ? iframeWindow : null,
    };
  };

  return {
    handlePointerDownCapture,
  };
}
