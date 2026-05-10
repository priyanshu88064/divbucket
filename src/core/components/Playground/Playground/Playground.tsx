import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useShortcuts from "@core/hooks/useShortcuts";
import { updateBgContentRect } from "@core/state/reducers/treeReducer";
import TabSection from "../TabSection.tsx/TabSection";
import type { RootState } from "@core/state/store";
import styles from "@core/utils/Resizable/resizable.module.css";
import NodeOverlays from "../../Overlays/NodeOverlays/NodeOverlays";
import EditorNodeShell from "../../Renderer/EditorNodeShell";
import { useMeasurementSync } from "@core/hooks/useNodeMeasurements";
import {
  selectActivePageId,
  selectNodeChildrenById,
} from "@core/state/selectors/treeSelectors";
import { memo } from "react";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export default function Playground() {
  useRenderCounter("Playground");
  const dispatch = useDispatch();
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [playgroundElement, setPlaygroundElement] =
    useState<HTMLDivElement | null>(null);
  const activePageId = useSelector(selectActivePageId);
  useShortcuts();

  useMeasurementSync({
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
  }, [wrapperElement]);

  return (
    <div
      id="playground"
      ref={setPlaygroundElement}
      className="flex-[1] flex flex-col overflow-hidden"
    >
      <TabSection />

      {activePageId && (
        <div
          id="wrapper_1"
          ref={setWrapperElement}
          className={`flex-[1] flex flex-col overflow-scroll ${styles.scroller}`}
        >
          <div
            id="wrapper_2"
            tabIndex={1}
            className="relative z-[1] flex-[1] flex justify-center"
          >
            <EditorNodeShell id={activePageId}>
              <NodeBranch parentId={activePageId} />
            </EditorNodeShell>
          </div>
          <NodeOverlays />
        </div>
      )}
    </div>
  );
}

const NodeBranch = memo(function NodeBranch({ parentId }: { parentId: number }) {
  useRenderCounter("PlaygroundNodeBranch");
  const children = useSelector((state: RootState) =>
    selectNodeChildrenById(state, parentId),
  );

  return (
    <>
      {children.map((nodeId) => (
        <EditorNodeShell key={nodeId} id={nodeId}>
          <NodeBranch parentId={nodeId} />
        </EditorNodeShell>
      ))}
    </>
  );
});
