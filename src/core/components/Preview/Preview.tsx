import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import { closePreview } from "@core/state/reducers/previewReducer";
import { IoExitOutline } from "react-icons/io5";
import { LuPaintBucket } from "react-icons/lu";
import { useGenerateCode } from "@core/hooks/useGenerateCode";
import {
  detectCanvasViewportPreset,
  resolveEffectiveViewportWidth,
} from "@core/hooks/canvasSession";

export default function Preview(): React.JSX.Element {
  const { generate } = useGenerateCode();
  const isOpen = useSelector((state: RootState) => state.previewReducer.isOpen);
  const pageId = useSelector(
    (state: RootState) => state.previewReducer.pageId,
  );
  const requestedPreset = useSelector(
    (state: RootState) => state.previewReducer.viewportPreset,
  );
  const requestedRootWidth = useSelector((state: RootState) => {
    if (!pageId) return "100%";
    return state.treeReducer.nodeStyleMap[pageId]?.default.width as
      | string
      | undefined;
  });
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const dispatch = useDispatch();

  const fallbackPreset = detectCanvasViewportPreset(requestedRootWidth || "100%");
  const viewportPreset = requestedPreset || fallbackPreset;
  const requestedWidth =
    viewportPreset === "mobile"
      ? "425px"
      : viewportPreset === "tablet"
        ? "768px"
        : viewportPreset === "desktop"
          ? "100%"
          : requestedRootWidth || "100%";
  const effectiveWidth = resolveEffectiveViewportWidth({
    requestedWidth,
    availableWidth,
  });
  const pageSrc = pageId
    ? generate({
        tab: pageId,
        isInternalStyleSheet: true,
      }).html
    : "";

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setAvailableWidth(Math.floor(width));
    });

    if (frameElement) observer.observe(frameElement);
    return () => {
      observer.disconnect();
    };
  }, [frameElement]);

  if (!isOpen || !pageId) return <></>;

  return createPortal(
    <div className="fixed z-[9999] top-0 left-0 h-full w-full bg-white flex flex-col">
      <div className="flex items-center justify-between bg-[#283037] h-8 text-gray-200 text-xs">
        <div className="flex items-baseline-last gap-1 text-orange-400">
          <LuPaintBucket size={20} className="ml-[30px] self-center" />
          <div className="text-[20px] font-bold italic">DIV</div>
          <div className="text-white text-xs">Bucket</div>
        </div>
        <div
          onClick={() => dispatch(closePreview())}
          className="uppercase h-full flex gap-2 items-center justify-center px-4 cursor-pointer border border-transparent hover:border-blue-400 active:bg-hoverblue"
        >
          Exit Preview
          <IoExitOutline size={16} />
        </div>
      </div>
      <div ref={setFrameElement} className="h-full w-full bg-[#1b2228] p-6">
        <div className="h-full w-full flex justify-center">
          <iframe
            srcDoc={pageSrc}
            className="h-full bg-white border border-gray-600"
            style={{
              width: availableWidth > 0 ? `${effectiveWidth}px` : "100%",
            }}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
