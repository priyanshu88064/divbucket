import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateBgContentRect } from "@core/state/reducers/treeReducer";
import { PAGE_BASE_CSS } from "@core/export/pageBaseCss";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { useIframeMeasurementSync } from "@core/hooks/useNodeMeasurements";
import { IFRAME_SURFACE_ID } from "@core/types/canvas";
import NodeOverlays from "../../Overlays/NodeOverlays/NodeOverlays";
import { PageTree } from "./PageTree";
import { useIframeCanvas } from "./useIframeCanvas";
import {
  isEditableEventTarget,
  setCanvasFocused,
} from "@core/hooks/canvasSession";
import { resolveEffectiveViewportWidth } from "@core/hooks/canvasSession";
import { selectNodeDefaultStyleById } from "@core/state/selectors/treeSelectors";
import type { RootState } from "@core/state/store";
import useShortcuts from "@core/hooks/useShortcuts";
import { useInlineTextEditActions } from "@core/hooks/useInlineTextEditActions";

export default function IframePlayground({
  activePageId,
}: {
  activePageId: number;
}) {
  useRenderCounter("IframePlayground");
  const dispatch = useDispatch();
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [availableWidth, setAvailableWidth] = useState(0);
  const { commitEditing } = useInlineTextEditActions();
  const requestedRootWidth = useSelector((state: RootState) =>
    selectNodeDefaultStyleById(state, activePageId).width as
      | string
      | undefined,
  );
  const { setIframeElement, canvasState } = useIframeCanvas({
    baseCss: PAGE_BASE_CSS,
  });
  useShortcuts({
    canvasMode: "iframe",
    surfaceWindow: canvasState.contentWindow,
    surfaceDocument: canvasState.contentDocument,
  });
  useIframeMeasurementSync({
    surfaceId: IFRAME_SURFACE_ID,
    iframeElement: canvasState.iframeElement,
    contentWindow: canvasState.contentWindow,
    contentDocument: canvasState.contentDocument,
  });

  useEffect(() => {
    const contentDocument = canvasState.contentDocument;
    if (!contentDocument) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!isEditableEventTarget(event.target)) {
        commitEditing();
      }
      setCanvasFocused(IFRAME_SURFACE_ID);
    };

    contentDocument.addEventListener("pointerdown", onPointerDown);
    return () => {
      contentDocument.removeEventListener("pointerdown", onPointerDown);
    };
  }, [canvasState.contentDocument, commitEditing]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setAvailableWidth(Math.floor(width));
    });
    if (wrapperElement) observer.observe(wrapperElement);

    return () => {
      observer.disconnect();
    };
  }, [wrapperElement]);

  const effectiveViewportWidth = resolveEffectiveViewportWidth({
    requestedWidth: requestedRootWidth || "100%",
    availableWidth,
  });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height, top, left } = entries[0].contentRect;
      dispatch(
        updateBgContentRect({
          bgContentRect: { width, height, top, left },
        }),
      );
    });
    if (canvasState.iframeElement) observer.observe(canvasState.iframeElement);

    return () => {
      observer.disconnect();
    };
  }, [canvasState.iframeElement, dispatch]);

  return (
    <div
      id="playground"
      className="wb-canvas-grid-bg flex-[1] flex flex-col overflow-hidden"
      onPointerDown={(event) => {
        if (!isEditableEventTarget(event.target)) {
          commitEditing();
        }
        setCanvasFocused(IFRAME_SURFACE_ID);
      }}
    >
      <div
        id="wrapper_1"
        ref={setWrapperElement}
        className="flex-[1] flex flex-col overflow-hidden px-5 pt-5 pb-0 md:px-6 md:pt-6 md:pb-0"
      >
        <div
          id="wrapper_2"
          className="relative z-[1] flex min-h-full flex-[1] justify-center overflow-hidden"
        >
          <iframe
            ref={setIframeElement}
            title="editor-canvas"
            src="about:blank"
            className="h-full border-0 bg-white"
            style={{
              width:
                availableWidth > 0 ? `${effectiveViewportWidth}px` : "100%",
            }}
          />
          {canvasState.isReady &&
            canvasState.mountElement &&
            createPortal(
              <div
                style={{
                  minHeight: "100%",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <PageTree
                  rootId={activePageId}
                  interactionMode="full-editor"
                  surfaceId={IFRAME_SURFACE_ID}
                />
              </div>,
              canvasState.mountElement,
            )}
        </div>
        <NodeOverlays />
      </div>
    </div>
  );
}
