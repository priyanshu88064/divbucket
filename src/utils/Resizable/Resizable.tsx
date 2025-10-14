import styles from "./resizable.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateActiveNode,
  updateHoverNodeId,
} from "../../store/reducers/treeReducer";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { changeTab } from "../../store/reducers/focusReducer";
import { MdOutlineEdit } from "react-icons/md";
import { TbMinusVertical } from "react-icons/tb";
import { GetIconOfType } from "../../components/Cssbar/Cssbar";
import { RiDragMove2Fill } from "react-icons/ri";
import type { AppDispatch, RootState } from "../../store/store";
import React from "react";
import { useResizer } from "../../hooks/useResizer";
import { useContextMenu } from "../../hooks/useContextMenu";

export default function Resizable({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id].default,
  );
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );
  const { dim, divRef, handleMouseDown } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const pureNode = (
    <div
      ref={divRef}
      id={type === "root" ? `node-root` : `node-${id}`}
      // data-root={id}
      // data-target={id}
      data-id={id}
      style={{ ...styleMap, ...dim }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(updateActiveNode({ id }));
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setClicked(true);
        setPoints({ x: e.pageX, y: e.pageY });
        dispatch(updateActiveNode({ id }));
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        dispatch(updateHoverNodeId({ id }));
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        dispatch(updateHoverNodeId({ id: null }));
      }}
    >
      {children}
    </div>
  );

  if (type === "root") {
    return (
      <div className="w-full flex justify-center overflow-hidden">
        {pureNode}

        {/* resizable right bar for root */}
        <div
          onMouseDown={(e) => handleMouseDown(e, 1)}
          className="w-2 cursor-ew-resize bg-gray-600 hover:bg-gray-500 transition-[background]"
        ></div>

        {/* context menu */}
        {clicked && (
          <ContextMenu id={id} points={points} setClicked={setClicked} />
        )}
      </div>
    );
  }

  return (
    <>
      {pureNode}

      {/* context menu */}
      {clicked && (
        <ContextMenu id={id} points={points} setClicked={setClicked} />
      )}
    </>
  );
}

export function Resizable2({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const activeNodeId = useSelector(
    (state: RootState) => state.treeReducer.activeNodeId,
  );
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id].default,
  );
  const name = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].name,
  );
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );
  const unit = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].unit,
  );
  const { dim, divRef, handleMouseDown } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  return (
    <div className={`${styles.awrap} ${type === "root" && styles.root}`}>
      {clicked && (
        <ContextMenu id={id} points={points} setClicked={setClicked} />
      )}
      <div
        ref={divRef}
        data-root={id}
        className={`${styles.a}`}
        style={{ ...styleMap, ...dim }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (id !== activeNodeId) dispatch(updateActiveNode({ id }));
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setClicked(true);
          setPoints({ x: e.pageX, y: e.pageY });
          dispatch(updateActiveNode({ id }));
        }}
      >
        {id === activeNodeId ? (
          <>
            <InfoBar name={name} type={type} id={id} />
            {type !== "root" && (
              <>
                <div
                  draggable={false}
                  onMouseDown={(e) => handleMouseDown(e, 0)}
                  className={`${styles.resizable} ${styles.top}`}
                ></div>
                <div
                  draggable={false}
                  onMouseDown={(e) => handleMouseDown(e, 1)}
                  className={`${styles.resizable} ${styles.right}`}
                ></div>
                <div
                  draggable={false}
                  onMouseDown={(e) => handleMouseDown(e, 2)}
                  className={`${styles.resizable} ${styles.bottom}`}
                ></div>
                <div
                  draggable={false}
                  onMouseDown={(e) => handleMouseDown(e, 3)}
                  className={`${styles.resizable} ${styles.left}`}
                ></div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 0)}
                  className={`${styles.circle} ${styles.ctop}`}
                ></div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 1)}
                  className={`${styles.circle} ${styles.cright}`}
                ></div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 2)}
                  className={`${styles.circle} ${styles.cbottom}`}
                ></div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 3)}
                  className={`${styles.circle} ${styles.cleft}`}
                ></div>
              </>
            )}
          </>
        ) : (
          type !== "root" && (
            <div
              data-target={id}
              className={`${styles.hov} ${unit && styles.unit}`}
            ></div>
          )
        )}
        {children}
      </div>
      {type === "root" && (
        <div
          onMouseDown={(e) => handleMouseDown(e, 1)}
          className={`${styles.resizablebar} ${styles.rightbar}`}
        >
          <TbMinusVertical className={styles.lines} />
        </div>
      )}
    </div>
  );
}

const InfoBar = ({
  name,
  type,
  id,
}: {
  name: string;
  type: string;
  id: number;
}) => {
  const dispatch = useDispatch();
  return (
    <div className="flex absolute top-0 left-0 -translate-y-full text-white bg-[#ff0099] rounded-xs z-[2] font-normal">
      <div className="text-xs flex items-center justify-center px-[7px] py-[5px] gap-[5px] border-r border-[rgba(255, 255, 255, 0.285)]">
        {GetIconOfType(type, 12)}
        {name}
      </div>
      <div
        style={{ cursor: "pointer" }}
        title="edit"
        onClick={() => dispatch(changeTab({ tab: "11" }))}
      >
        <MdOutlineEdit size={12} />
      </div>
      {type !== "root" && (
        <div
          draggable
          data-id={id}
          style={{ borderRight: "none", cursor: "grab" }}
        >
          <RiDragMove2Fill size={14} />
        </div>
      )}
    </div>
  );
};
