import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { GetIconOfType } from "../Cssbar/Cssbar";
import { changeTab } from "../../store/reducers/focusReducer";
import { MdOutlineEdit } from "react-icons/md";
import { RiDragMove2Fill } from "react-icons/ri";

export default function NodeOverlays() {
  const activeNodeId = useSelector(
    (state: RootState) => state.treeReducer.activeNodeId,
  );

  return (
    <>
      {activeNodeId && <Infobar activeNodeId={activeNodeId} />}
      <HoverBar />
    </>
  );
}

const Infobar = ({ activeNodeId }: { activeNodeId: number }) => {
  const dispatch = useDispatch();
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[activeNodeId].type,
  );
  const name = useSelector(
    (state: RootState) => state.treeReducer.dataMap[activeNodeId].name,
  );
  const [dim, setDim] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // event listeners for syncing position of infobar overlay
  useEffect(() => {
    if (type === "root") {
      setDim({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const nodeDim = document.getElementById(`node-${activeNodeId}`);
    const treeManager = document.getElementById("tree-manager");
    const nodeRoot = document.getElementById("node-root");
    const bgRef = document.getElementById("bgRef");
    if (!nodeDim || !treeManager || !nodeRoot || !bgRef) return;

    const updateDim = () => {
      setDim(nodeDim.getBoundingClientRect());
    };

    const observer = new ResizeObserver(updateDim);
    observer.observe(nodeDim);

    const observer2 = new ResizeObserver(updateDim);
    observer2.observe(nodeRoot);

    const observer3 = new ResizeObserver(updateDim);
    observer3.observe(bgRef);

    treeManager.addEventListener("scroll", updateDim);

    updateDim();

    return () => {
      observer.disconnect();
      observer2.disconnect();
      observer3.disconnect();
      treeManager.removeEventListener("scroll", updateDim);
    };
  }, [activeNodeId, type]);

  if (type === "root") return <></>;

  return (
    <>
      <div
        style={{
          top: dim.top,
          left: dim.left,
        }}
        className={`flex gap-1 fixed -translate-y-[120%] [&>div]:bg-[#aa00d9] z-[2]`}
      >
        <div className="flex items-center justify-center gap-1 p-0.5 px-2 text-white text-[11px] rounded-xs">
          {GetIconOfType(type, 10)}
          {name}
        </div>
        <div
          title="edit"
          onClick={() => dispatch(changeTab({ tab: "11" }))}
          className="flex items-center px-2 cursor-pointer rounded-xs"
        >
          <MdOutlineEdit size={10} color="white" />
        </div>
        {type !== "root" && (
          <div
            draggable
            data-id={activeNodeId}
            style={{ borderRight: "none", cursor: "grab" }}
            className="px-2 flex items-center rounded-xs cursor-grab"
          >
            <RiDragMove2Fill size={12} color="white" />
          </div>
        )}
      </div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 0)}
        style={{
          top: dim.top,
          left: dim.left,
          width: dim.width,
          height: "1px",
        }}
        className={`fixed border-t-2 border-[var(--resizeblue)] cursor-ns-resize}`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 1)}
        style={{
          top: dim.top,
          left: dim.left + dim.width,
          width: "1px",
          height: dim.height + 1,
        }}
        className={`fixed border-r-2 border-[var(--resizeblue)] cursor-ew-resize`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 2)}
        style={{
          top: dim.top + dim.height,
          left: dim.left,
          width: dim.width + 1,
          height: "1px",
        }}
        className={`fixed border-b-2 border-[var(--resizeblue)] cursor-ns-resize`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 3)}
        style={{
          top: dim.top,
          left: dim.left,
          width: "1px",
          height: dim.height,
        }}
        className={`fixed border-l-2 border-[var(--resizeblue)] cursor-ew-resize`}
      ></div>
    </>
  );
};

const HoverBar = () => {
  const hoverNodeId = useSelector(
    (state: RootState) => state.treeReducer.hoverNodeId,
  );
  const activeNodeId = useSelector(
    (state: RootState) => state.treeReducer.activeNodeId,
  );

  const [dim, setDim] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // event listeners for syncing position of hover overlay
  useEffect(() => {
    if (!hoverNodeId) {
      setDim({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const nodeDim = document.getElementById(`node-${hoverNodeId}`);
    const treeManager = document.getElementById("tree-manager");
    if (!treeManager || !nodeDim) return;

    const updateDim = () => {
      setDim(nodeDim.getBoundingClientRect());
    };

    treeManager.addEventListener("scroll", updateDim);
    updateDim();

    return () => {
      treeManager.removeEventListener("scroll", updateDim);
    };
  }, [hoverNodeId]);

  return (
    <>
      {activeNodeId !== hoverNodeId && (
        <>
          <div
            style={{
              top: dim.top,
              left: dim.left,
              width: dim.width,
              height: "1px",
            }}
            className={`pointer-events-none fixed border-t border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: dim.top,
              left: dim.left + dim.width - 1,
              width: "1px",
              height: dim.height,
            }}
            className={`pointer-events-none fixed border-r border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: dim.top + dim.height - 1,
              left: dim.left,
              width: dim.width,
              height: "1px",
            }}
            className={`pointer-events-none fixed border-b border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: dim.top,
              left: dim.left,
              width: "1px",
              height: dim.height,
            }}
            className={`pointer-events-none fixed border-l border-[var(--resizeblue)]`}
          ></div>
        </>
      )}
    </>
  );
};
