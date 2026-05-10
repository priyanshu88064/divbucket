import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import ContextMenu from "../Overlays/ContextMenu/ContextMenu";
import {
  updateActiveNode,
  updateHoverNodeId,
} from "@core/state/reducers/treeReducer";
import { useContextMenu } from "@core/hooks/useContextMenu";
import { useResizer } from "@core/hooks/useResizer";
import { registerNodeElement } from "@core/hooks/useNodeMeasurements";
import DocumentNodeView from "./DocumentNodeView";
import {
  selectNodeDefaultStyleById,
  selectNodeRecordById,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export interface EditorNodeShellProps {
  id: number;
  children?: React.ReactNode;
}

function EditorNodeShell({
  id,
  children,
}: EditorNodeShellProps) {
  useRenderCounter("EditorNodeShell");
  const dispatch = useDispatch();
  const styleMap = useSelector((state: RootState) =>
    selectNodeDefaultStyleById(state, id),
  );
  const nodeRecord = useSelector((state: RootState) =>
    selectNodeRecordById(state, id),
  );

  const { dim, divRef, handleMouseDown } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();

  const type = nodeRecord.type;

  const registerElement = (nodeId: number, element: HTMLElement | null) => {
    registerNodeElement(nodeId, element);
    divRef.current = element as HTMLDivElement | null;
  };

  const content = "content" in nodeRecord ? nodeRecord.content : undefined;
  const media = "media" in nodeRecord ? nodeRecord.media : undefined;

  const pureNode = (
    <DocumentNodeView
      id={id}
      type={type}
      style={{ ...styleMap, ...dim }}
      content={content}
      media={media}
      registerElement={registerElement}
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
    </DocumentNodeView>
  );

  if (type === "core:root") {
    return (
      <div className="w-full flex justify-center overflow-hidden">
        {pureNode}

        <div
          onMouseDown={(e) => handleMouseDown(e, 1)}
          className="w-2 cursor-ew-resize bg-gray-600 hover:bg-gray-500 transition-[background]"
        ></div>

        {clicked && (
          <ContextMenu id={id} points={points} setClicked={setClicked} />
        )}
      </div>
    );
  }

  return (
    <>
      {pureNode}
      {clicked && (
        <ContextMenu id={id} points={points} setClicked={setClicked} />
      )}
    </>
  );
}

export default React.memo(EditorNodeShell);
