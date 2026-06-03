import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import { GetIconOfType } from "../../Cssbar/Cssbar";
import { changeTab } from "@core/state/reducers/focusReducer";
import { MdOutlineEdit } from "react-icons/md";
import { RiDragMove2Fill } from "react-icons/ri";
import { getNodeSurfaceId, useNodeRect } from "@core/hooks/useNodeMeasurements";
import { useDragState } from "@core/hooks/useDragState";
import {
  selectActiveNodeId,
  selectHoverNodeId,
  selectNodeRecordById,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { setCanvasFocused } from "@core/hooks/canvasSession";
import { isContentNodeRecord, isCoreContentNodeKind } from "@core/types/document";
import { useInlineTextEditState } from "@core/hooks/inlineTextEditSession";
import { useInlineTextEditActions } from "@core/hooks/useInlineTextEditActions";
import { useEffect } from "react";

export default function NodeOverlays() {
  useRenderCounter("NodeOverlays");
  const activeNodeId = useSelector(selectActiveNodeId);
  const { isDragging, indicator, ghost } = useDragState();
  const inlineTextEditState = useInlineTextEditState();
  const editingNodeRecord = useSelector((state: RootState) =>
    inlineTextEditState.editingNodeId
      ? selectNodeRecordById(state, inlineTextEditState.editingNodeId)
      : null,
  );
  const { cancelEditing } = useInlineTextEditActions();

  useEffect(() => {
    if (inlineTextEditState.editingNodeId && !editingNodeRecord) {
      cancelEditing();
    }
  }, [
    cancelEditing,
    editingNodeRecord,
    inlineTextEditState.editingNodeId,
  ]);

  return (
    <>
      {activeNodeId && <Infobar activeNodeId={activeNodeId} />}
      <HoverBar />
      <OverlayExtensionSlot />
      {isDragging && indicator && (
        <div
          style={{
            top: indicator.top,
            left: indicator.left,
            width: indicator.width,
            height: indicator.height,
          }}
          className="fixed z-[3] bg-hoverblue/60 rounded-md pointer-events-none transition-all ease-out"
        ></div>
      )}
      {isDragging && ghost && (
        <div
          style={{
            top: ghost.y + 14,
            left: ghost.x + 14,
          }}
          className="fixed z-[5] bg-[#333C46] text-[var(--text_0)] text-xs px-3 py-1 rounded-sm border border-gray-500 pointer-events-none"
        >
          {ghost.label}
        </div>
      )}
    </>
  );
}

const Infobar = ({ activeNodeId }: { activeNodeId: number }) => {
  useRenderCounter("NodeOverlayInfobar");
  const dispatch = useDispatch();
  const nodeRecord = useSelector((state: RootState) =>
    selectNodeRecordById(state, activeNodeId),
  );
  const position = useNodeRect(activeNodeId);
  const inlineTextEditState = useInlineTextEditState();
  const { startEditing } = useInlineTextEditActions();

  if (!nodeRecord || nodeRecord.type === "core:root" || !position) return <></>;

  const isInlineEditingNode = inlineTextEditState.editingNodeId === activeNodeId;
  const showActions = !isInlineEditingNode;
  const surfaceId = getNodeSurfaceId(activeNodeId);

  return (
    <>
      {showActions && (
        <div
          style={{
            top: position.top,
            left: position.left,
          }}
          className={`flex gap-1 fixed z-[4] -translate-y-[120%] [&>div]:bg-[#aa00d9]`}
        >
          <div className="flex items-center justify-center gap-1 p-0.5 px-2 text-white text-[11px] rounded-xs">
            {GetIconOfType(nodeRecord.type, 10)}
            {nodeRecord.name || nodeRecord.type}
          </div>
          <div
            title="edit"
            onClick={() => {
              setCanvasFocused(surfaceId);
              if (isCoreContentNodeKind(nodeRecord.type) && isContentNodeRecord(nodeRecord)) {
                startEditing({
                  nodeId: activeNodeId,
                  surfaceId,
                  initialContent: nodeRecord.content,
                });
                return;
              }
              dispatch(changeTab({ tab: "11" }));
            }}
            className="flex items-center px-2 cursor-pointer rounded-xs"
          >
            <MdOutlineEdit size={10} color="white" />
          </div>
          <div
            data-canvas-drag-source="node"
            data-canvas-node-id={activeNodeId}
            onPointerDown={(e) => {
              e.stopPropagation();
              setCanvasFocused(surfaceId);
            }}
            style={{ borderRight: "none", cursor: "grab" }}
            className="px-2 flex items-center rounded-xs cursor-grab"
          >
            <RiDragMove2Fill size={12} color="white" />
          </div>
        </div>
      )}
      {!isInlineEditingNode && (
        <OutlineOverlay
          rect={position}
          className="pointer-events-none fixed z-[2] border-2 border-[var(--resizeblue)]"
        />
      )}
    </>
  );
};

const HoverBar = () => {
  useRenderCounter("NodeOverlayHoverBar");
  const hoverNodeId = useSelector(selectHoverNodeId);
  const activeNodeId = useSelector(selectActiveNodeId);
  const hoverNodeType = useSelector((state: RootState) =>
    hoverNodeId ? selectNodeRecordById(state, hoverNodeId)?.type : null,
  );

  const position = useNodeRect(hoverNodeId);

  return (
    <>
      {hoverNodeType !== "core:root" && activeNodeId !== hoverNodeId && position && (
        <OutlineOverlay
          rect={position}
          className="pointer-events-none fixed z-[2] border border-[var(--resizeblue)]"
        />
      )}
    </>
  );
};

const OutlineOverlay = ({
  rect,
  className,
}: {
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  className: string;
}) => (
  <div
    style={{
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }}
    className={className}
  ></div>
);

const OverlayExtensionSlot = () => null;
