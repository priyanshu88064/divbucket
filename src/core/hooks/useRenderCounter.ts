import { useEffect } from "react";
import { trackRender } from "@core/editor/ui/renderPerf";

export const useRenderCounter = (name: string) => {
  useEffect(() => {
    trackRender(name);
  });
};
