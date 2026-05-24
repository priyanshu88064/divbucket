import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  cut,
  copy,
  duplicate,
  paste,
  redo,
  undo,
} from "@core/state/reducers/treeReducer";
import { useCanvasFocusState } from "./canvasSession";
import {
  attachCanvasKeyboardListeners,
  shouldHandleCanvasShortcut,
} from "./canvasSession";
import type { CanvasMode } from "@core/types/canvas";
import { getCanvasKeyboardTargets } from "./canvasRuntime";

export default function useShortcuts({
  canvasMode = "legacy",
  surfaceWindow,
  surfaceDocument,
}: {
  canvasMode?: CanvasMode;
  surfaceWindow?: Window | null;
  surfaceDocument?: Document | null;
} = {}) {
  const dispatch = useDispatch();
  const { isCanvasFocused } = useCanvasFocusState();

  useEffect(() => {
    const handlePress = (event: KeyboardEvent) => {
      if (!shouldHandleCanvasShortcut({ isCanvasFocused, event })) return;
      const key = event.key.toLowerCase();
      event.preventDefault();
      if (key === "x") dispatch(cut());
      if (key === "c") dispatch(copy());
      if (key === "v") dispatch(paste());
      if (key === "d") dispatch(duplicate());
      if (key === "z" && event.shiftKey) dispatch(redo());
      if (key === "z" && !event.shiftKey) dispatch(undo());
      if (key === "y") dispatch(redo());
    };

    const handleUp = () => {};

    return attachCanvasKeyboardListeners({
      targets: getCanvasKeyboardTargets({
        canvasMode,
        surfaceWindow,
        surfaceDocument,
      }),
      onKeyDown: handlePress,
      onKeyUp: handleUp,
    });
  }, [canvasMode, dispatch, isCanvasFocused, surfaceDocument, surfaceWindow]);
}
