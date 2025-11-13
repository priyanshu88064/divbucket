import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ContextMenu from "../Overlays/ContextMenu/ContextMenu";
import {
  updateActiveNode,
  updateHoverNodeId,
} from "../../store/reducers/treeReducer";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useResizer } from "../../hooks/useResizer";
import React from "react";

export default function NodeRenderer({
  id,
  children,
}: {
  id: number;
  children?: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id].default,
  );
  // const bgContentRect = useSelector((state: RootState) => state.treeReducer.bgContentRect);
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );

  const src = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.src,
  );
  const alt = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].media?.alt,
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
  const content = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].content,
  );

  const { dim, divRef, handleMouseDown } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const commonNodeProps = {
    id: type === "root" ? `node-root` : `node-${id}`,
    "data-id": id,
    "data-type": type,
    style: { ...styleMap, ...dim },
    onClick: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(updateActiveNode({ id }));
    },
    onContextMenu: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setClicked(true);
      setPoints({ x: e.pageX, y: e.pageY });
      dispatch(updateActiveNode({ id }));
    },
    onMouseOver: (e: any) => {
      e.stopPropagation();
      dispatch(updateHoverNodeId({ id }));
    },
    onMouseLeave: (e: any) => {
      e.stopPropagation();
      dispatch(updateHoverNodeId({ id: null }));
    },
  };

  const pureNode = (() => {
    switch (type) {
      case "Button":
        return <div {...commonNodeProps}>{content}</div>;

      case "Heading":
        return <div {...commonNodeProps}>{content}</div>;

      case "Paragraph":
        return <div {...commonNodeProps}>{content}</div>;

      case "Text":
        return <div {...commonNodeProps}>{content}</div>;

      case "Video":
        return (
          <video
            {...commonNodeProps}
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
          ></video>
        );

      case "Image":
        return <img {...commonNodeProps} src={src} alt={alt} />;

      default:
        return (
          <div ref={divRef} {...commonNodeProps}>
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
  // console.log(bgContentRect)
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
