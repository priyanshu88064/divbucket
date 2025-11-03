import { useDispatch, useSelector } from "react-redux";
import {
  updateActiveNode,
  updateHoverNodeId,
} from "../../store/reducers/treeReducer";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import type { AppDispatch, RootState } from "../../store/store";
import React from "react";
import { useResizer } from "../../hooks/useResizer";
import { useContextMenu } from "../../hooks/useContextMenu";

export default function Resizable({
  id,
  children,
}: {
  id: number;
  children?: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id].default,
  );
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );

  // for video
  const src = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.src,
  );
  const autoPlay = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.autoPlay,
  );
  const muted = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.muted,
  );
  const controls = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.controls,
  );
  const loop = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.loop,
  );

  const { dim, divRef, handleMouseDown } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const pureNode = (() => {
    // because not every element can be a div (eg. video, image)
    switch (type) {
      case "Video":
        return (
          <video
            // ref={divRef}
            id={`node-${id}`}
            data-id={id}
            data-type={type}
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
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
          ></video>
        );
      default:
        return (
          <div
            ref={divRef}
            id={type === "root" ? `node-root` : `node-${id}`}
            data-id={id}
            data-type={type}
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
    }
  })();

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
