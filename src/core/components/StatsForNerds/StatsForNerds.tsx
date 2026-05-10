import { useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import { MdContentCopy } from "react-icons/md";
import type {
  NodeRecordMap,
  NodeStyleMap,
  NodeChildrenMap,
} from "@core/types/document";
import PerfPanel from "./PerfPanel";
import {
  selectActiveNodeId,
  selectActivePageId,
  selectClipboard,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

// this is actually creating a template unlike 'createTemplate' in utils/template.ts
const createState = ({
  tree,
  styleMap,
  dataMap,
  node,
}: {
  tree: NodeChildrenMap;
  styleMap: NodeStyleMap;
  dataMap: NodeRecordMap;
  node: number;
}) => {
  let stateTree: NodeChildrenMap = {};
  let stateStyleMap: NodeStyleMap = {};
  let stateDataMap: NodeRecordMap = {};

  const work = (node: number) => {
    stateStyleMap[node] = styleMap[node];
    stateDataMap[node] = dataMap[node];
    stateTree[node] = tree[node].map((childNode) => work(childNode));
    return node;
  };
  work(node);
  return { tree: stateTree, styleMap: stateStyleMap, dataMap: stateDataMap };
};

export default function StatsForNerds(): React.JSX.Element {
  useRenderCounter("StatsForNerds");
  const isDragging = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const [cord, setCord] = useState({ x: 0, y: 0 });

  const activeNodeId = useSelector(selectActiveNodeId);
  const activePageId = useSelector(selectActivePageId);
  const clipboard = useSelector(selectClipboard);
  const tree = useSelector(
    (state: RootState) => state.treeReducer.nodeChildrenMap,
  );
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.nodeStyleMap,
  );
  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.nodeRecordMap,
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setCord({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  return createPortal(
    <div
      ref={ref}
      onMouseDown={(e) => {
        if (!ref.current) return;

        isDragging.current = true;
        offset.current.x = e.clientX - ref.current.offsetLeft;
        offset.current.y = e.clientY - ref.current.offsetTop;
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      style={{ top: cord.y, left: cord.x }}
      className="fixed z-[99] max-h-128 w-64 p-4 grid grid-cols-[35%_auto] gap-y-2 bg-black/80 text-xs font-semibold select-none active:cursor-move overflow-y-scroll rounded-sm"
    >
      <div className="text-gray-200 text-sm p-1 pl-0 whitespace-nowrap w-fit">
        Stats for nerds 😔
      </div>
      <div></div>
      <div className="text-green-500">Tab</div>
      <div className="text-[#F3901C]">{activePageId}</div>

      <div className="text-green-500">Node</div>
      <div className="text-[#F3901C]">{activeNodeId}</div>

      <div className="text-green-500">Cut</div>
      <div className="text-[#F3901C]">{clipboard.cut}</div>

      <div className="text-green-500">Copy</div>
      <div className="text-[#F3901C]">{clipboard.copy}</div>

      <div className="text-green-500">Childrens</div>
      <div className="text-[#F3901C]">
        {activeNodeId ? tree[activeNodeId].join(", ") : ""}
      </div>

      {activeNodeId ? (
        <div
          onClick={() => {
            const state = createState({
              tree,
              styleMap,
              dataMap,
              node: activeNodeId,
            });
            navigator.clipboard.writeText(JSON.stringify(state, null, 2));
          }}
          className="text-gray-200 font-normal flex items-center gap-2 w-fit whitespace-nowrap border border-gray-600 py-1 px-2 mt-4 rounded-sm hover:border-blue-400 active:bg-hoverblue cursor-default"
        >
          State <MdContentCopy />
        </div>
      ) : (
        <></>
      )}
      {import.meta.env.DEV && <PerfPanel />}
    </div>,
    document.body,
  );
}
