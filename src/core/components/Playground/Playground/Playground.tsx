import { useSelector } from "react-redux";
import TabSection from "../TabSection.tsx/TabSection";
import { selectActivePageId } from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { resolveCanvasMode } from "@core/types/canvas";
import LegacyPlayground from "./LegacyPlayground";
import IframePlayground from "./IframePlayground";

export default function Playground() {
  useRenderCounter("Playground");
  const activePageId = useSelector(selectActivePageId);
  const canvasMode = resolveCanvasMode();

  return (
    <div className="flex-[1] flex flex-col overflow-hidden bg-[var(--wb_workspace)]">
      <TabSection />

      {activePageId && (
        <>
          {canvasMode === "legacy" ? (
            <LegacyPlayground activePageId={activePageId} />
          ) : (
            <IframePlayground activePageId={activePageId} />
          )}
        </>
      )}
    </div>
  );
}
