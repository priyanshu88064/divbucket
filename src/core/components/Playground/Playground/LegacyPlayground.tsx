import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "@core/utils/Resizable/resizable.module.css";
import { updateBgContentRect } from "@core/state/reducers/treeReducer";
import NodeOverlays from "../../Overlays/NodeOverlays/NodeOverlays";
import { useMeasurementSync } from "@core/hooks/useNodeMeasurements";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { PageTree } from "./PageTree";
import { LEGACY_SURFACE_ID } from "@core/types/canvas";
import {
  isEditableEventTarget,
  setCanvasFocused,
} from "@core/hooks/canvasSession";
import useShortcuts from "@core/hooks/useShortcuts";
import { useInlineTextEditActions } from "@core/hooks/useInlineTextEditActions";

export default function LegacyPlayground({
  activePageId,
}: {
  activePageId: number;
}) {
  useRenderCounter("LegacyPlayground");
  useShortcuts({ canvasMode: "legacy" });
  const dispatch = useDispatch();
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [playgroundElement, setPlaygroundElement] =
    useState<HTMLDivElement | null>(null);
  const { commitEditing } = useInlineTextEditActions();

  useMeasurementSync({
    surfaceId: LEGACY_SURFACE_ID,
    scrollElement: wrapperElement,
    viewportElement: playgroundElement,
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
    if (wrapperElement) observer.observe(wrapperElement);

    return () => {
      observer.disconnect();
    };
  }, [dispatch, wrapperElement]);

  return (
    <div
      id="playground"
      ref={setPlaygroundElement}
      onPointerDown={(event) => {
        if (!isEditableEventTarget(event.target)) {
          commitEditing();
        }
        setCanvasFocused(LEGACY_SURFACE_ID);
      }}
      className="wb-canvas-grid-bg flex-[1] flex flex-col overflow-hidden"
    >
      <div
        id="wrapper_1"
        ref={setWrapperElement}
        className={`flex-[1] flex flex-col overflow-auto px-5 pt-5 pb-0 md:px-6 md:pt-6 md:pb-0 ${styles.scroller}`}
      >
        <div
          id="wrapper_2"
          className="relative z-[1] flex min-h-full flex-[1] justify-center overflow-hidden"
        >
          <PageTree
            rootId={activePageId}
            interactionMode="full-editor"
            surfaceId={LEGACY_SURFACE_ID}
          />
        </div>
        <NodeOverlays />
      </div>
    </div>
  );
}
