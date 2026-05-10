import { useEffect, useState } from "react";
import type { IframeCanvasState } from "@core/types/canvas";
import { bootstrapIframeCanvasDocument } from "./iframeDocument";

export function useIframeCanvas({ baseCss }: { baseCss: string }) {
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(
    null,
  );
  const [canvasState, setCanvasState] = useState<IframeCanvasState>({
    iframeElement: null,
    mountElement: null,
    contentDocument: null,
    contentWindow: null,
    isReady: false,
  });

  useEffect(() => {
    if (!iframeElement) {
      setCanvasState({
        iframeElement: null,
        mountElement: null,
        contentDocument: null,
        contentWindow: null,
        isReady: false,
      });
      return;
    }

    const contentDocument = iframeElement.contentDocument;
    const contentWindow = iframeElement.contentWindow;
    if (!contentDocument || !contentWindow) {
      setCanvasState({
        iframeElement,
        mountElement: null,
        contentDocument: null,
        contentWindow: null,
        isReady: false,
      });
      return;
    }

    const mountElement = bootstrapIframeCanvasDocument({
      contentDocument,
      baseCss,
    });
    setCanvasState({
      iframeElement,
      mountElement,
      contentDocument,
      contentWindow,
      isReady: true,
    });
  }, [baseCss, iframeElement]);

  return {
    iframeElement,
    setIframeElement,
    canvasState,
  };
}
