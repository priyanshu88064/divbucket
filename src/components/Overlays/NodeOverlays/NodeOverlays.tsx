import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { GetIconOfType } from "../../Cssbar/Cssbar";
import { changeTab } from "../../../store/reducers/focusReducer";
import { MdOutlineEdit } from "react-icons/md";
import { RiDragMove2Fill } from "react-icons/ri";
import { getPositionOfNode } from "../../../hooks/getPositionOfNode";

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
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[activeNodeId],
  );
  const { position } = getPositionOfNode({ id: activeNodeId, type, styleMap });

  if (type === "root") return <></>;

  return (
    <>
      <div
        style={{
          top: position.top,
          left: position.left,
        }}
        className={`flex gap-1 fixed z-[4] -translate-y-[120%] [&>div]:bg-[#aa00d9]`}
      >
        <div className="flex items-center justify-center gap-1 p-0.5 px-2 text-white text-[11px] rounded-xs">
          {GetIconOfType(type, 10)}
          {name || type}
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
          top: position.top,
          left: position.left,
          width: position.width,
          height: "1px",
        }}
        className={`fixed z-[2] border-t-2 border-[var(--resizeblue)]`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 1)}
        style={{
          top: position.top,
          left: position.left + position.width,
          width: "1px",
          height: position.height + 1,
        }}
        className={`fixed z-[2] border-r-2 border-[var(--resizeblue)]`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 2)}
        style={{
          top: position.top + position.height,
          left: position.left,
          width: position.width + 1,
          height: "1px",
        }}
        className={`fixed z-[2] border-b-2 border-[var(--resizeblue)]`}
      ></div>
      <div
        draggable={false}
        // onMouseDown={(e) => handleMouseDown(e, 3)}
        style={{
          top: position.top,
          left: position.left,
          width: "1px",
          height: position.height,
        }}
        className={`fixed z-[2] border-l-2 border-[var(--resizeblue)]`}
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

  const { position } = getPositionOfNode({ id: hoverNodeId });

  return (
    <>
      {activeNodeId !== hoverNodeId && (
        <>
          <div
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              height: "1px",
            }}
            className={`pointer-events-none fixed z-[2] border-t border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: position.top,
              left: position.left + position.width - 1,
              width: "1px",
              height: position.height,
            }}
            className={`pointer-events-none fixed z-[2] border-r border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: position.top + position.height - 1,
              left: position.left,
              width: position.width,
              height: "1px",
            }}
            className={`pointer-events-none fixed z-[2] border-b border-[var(--resizeblue)]`}
          ></div>
          <div
            style={{
              top: position.top,
              left: position.left,
              width: "1px",
              height: position.height,
            }}
            className={`pointer-events-none fixed z-[2] border-l border-[var(--resizeblue)]`}
          ></div>
        </>
      )}
    </>
  );
};
