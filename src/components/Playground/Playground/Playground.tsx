import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useShortcuts from "../../../hooks/useShortcuts";
import { updateBgContentRect } from "../../../store/reducers/treeReducer";
import TabSection from "../TabSection.tsx/TabSection";
import type { RootState } from "../../../store/store";
import styles from "../../../utils/Resizable/resizable.module.css";
import NodeOverlays from "../../Overlays/NodeOverlays/NodeOverlays";
import NodeRenderer from "../../Renderer/NodeRenderer";
import { syncCSSPosition } from "../../../hooks/syncCSSPosition";

export default function Playground() {
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tree = useSelector((state: RootState) => state.treeReducer.tree);
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
  useShortcuts();

  // bad ;( bad bad temporary fix for syncing position 'fixed'
  syncCSSPosition();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height, top, left } = entries[0].contentRect;
      dispatch(
        updateBgContentRect({
          bgContentRect: { width, height, top, left },
        }),
      );
    });
    if (wrapperRef && wrapperRef.current) observer.observe(wrapperRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderTree = (id: number) => {
    return tree[id].map((children) => (
      <NodeRenderer key={children} id={children}>
        {renderTree(children)}
      </NodeRenderer>
    ));
  };

  return (
    <div id="playground" className="flex-[1] flex flex-col overflow-hidden">
      <TabSection />

      {activeTab && (
        <div
          id="wrapper_1"
          ref={wrapperRef}
          className={`flex-[1] flex flex-col overflow-scroll ${styles.scroller}`}
        >
          <div
            id="wrapper_2"
            tabIndex={1}
            className="relative z-[1] flex-[1] flex justify-center"
          >
            <NodeRenderer id={activeTab}>{renderTree(activeTab)}</NodeRenderer>
          </div>
          <NodeOverlays />
        </div>
      )}
    </div>
  );
}
