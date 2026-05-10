import { useEffect } from "react";
import { clearCanvasFocus, isEditableEventTarget } from "./canvasSession";
import { isCanvasOwnedTarget } from "./canvasRuntime";

export default function useCanvasFocusGuards() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (isCanvasOwnedTarget(event.target)) return;
      clearCanvasFocus();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (isCanvasOwnedTarget(event.target)) return;
      if (isEditableEventTarget(event.target)) {
        clearCanvasFocus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, []);
}
