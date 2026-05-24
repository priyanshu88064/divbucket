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
import {
  registerNodeElement,
  translateSurfacePointToParentViewport,
} from "@core/hooks/useNodeMeasurements";
import DocumentNodeView from "./DocumentNodeView";
import type { EditorInteractionMode } from "@core/types/canvas";
import { LEGACY_SURFACE_ID } from "@core/types/canvas";
import {
  selectNodeDefaultStyleById,
  selectNodeRecordById,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { setCanvasFocused } from "@core/hooks/canvasSession";

export interface EditorNodeShellProps {
  id: number;
  children?: React.ReactNode;
  interactionMode?: EditorInteractionMode;
  surfaceId?: string;
}

function EditorNodeShell({
  id,
  children,
  interactionMode = "full-editor",
  surfaceId = LEGACY_SURFACE_ID,
}: EditorNodeShellProps) {
  useRenderCounter("EditorNodeShell");
  const dispatch = useDispatch();
  const styleMap = useSelector((state: RootState) =>
    selectNodeDefaultStyleById(state, id),
  );
  const nodeRecord = useSelector((state: RootState) =>
    selectNodeRecordById(state, id),
  );

  const { dim, divRef } = useResizer({ id });
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const isInteractive = interactionMode === "full-editor";

  const type = nodeRecord.type;

  const registerElement = (nodeId: number, element: HTMLElement | null) => {
    registerNodeElement(nodeId, element, surfaceId);
    divRef.current = element as HTMLDivElement | null;
  };

  const content = "content" in nodeRecord ? nodeRecord.content : undefined;
  const media = "media" in nodeRecord ? nodeRecord.media : undefined;

  const pureNode = (
    <DocumentNodeView
      id={id}
      type={type}
      style={{ ...styleMap, ...dim }}
      record={nodeRecord}
      content={content}
      media={media}
      registerElement={registerElement}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setCanvasFocused(surfaceId);
        dispatch(updateActiveNode({ id }));
      }}
      onContextMenu={(e) => {
        if (!isInteractive) return;
        e.preventDefault();
        e.stopPropagation();
        const translatedPoint = translateSurfacePointToParentViewport({
          surfaceId,
          point: {
            x: e.clientX,
            y: e.clientY,
          },
        });
        setClicked(true);
        setPoints(translatedPoint);
        setCanvasFocused(surfaceId);
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
      <div
        className="w-full flex justify-center overflow-hidden"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {pureNode}

        {isInteractive && clicked && (
          <ContextMenu id={id} points={points} setClicked={setClicked} />
        )}
      </div>
    );
  }

  return (
    <>
      {pureNode}
      {isInteractive && clicked && (
        <ContextMenu id={id} points={points} setClicked={setClicked} />
      )}
    </>
  );
}

export default React.memo(EditorNodeShell);
