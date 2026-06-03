import React, { useEffect, useMemo, useRef } from "react";
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
import {
  isEditableEventTarget,
  setCanvasFocused,
} from "@core/hooks/canvasSession";
import { isContentNodeRecord, isCoreContentNodeKind } from "@core/types/document";
import {
  updateInlineTextDraft,
  useInlineTextEditState,
} from "@core/hooks/inlineTextEditSession";
import { useInlineTextEditActions } from "@core/hooks/useInlineTextEditActions";
import {
  extractPlainTextFromEditable,
  insertPlainTextAtSelection,
  placeCaretAtPoint,
  selectAllEditableText,
  writePlainTextToEditable,
} from "@core/utils/inlineText";

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
  const inlineEditorRef = useRef<HTMLElement | null>(null);
  const appliedInlineSessionKeyRef = useRef<string | null>(null);
  const pendingCaretPointRef = useRef<{ x: number; y: number } | null>(null);
  const inlineTextEditState = useInlineTextEditState();
  const { startEditing, commitEditing, cancelEditing } =
    useInlineTextEditActions();

  const type = nodeRecord.type;
  const isInlineEditableNode = isCoreContentNodeKind(type);
  const isInlineEditingNode =
    isInlineEditableNode && inlineTextEditState.editingNodeId === id;
  const inlineSessionKey = useMemo(
    () =>
      isInlineEditingNode
        ? `${inlineTextEditState.editingNodeId}:${inlineTextEditState.surfaceId}:${inlineTextEditState.originalContent}`
        : null,
    [
      inlineTextEditState.editingNodeId,
      inlineTextEditState.originalContent,
      inlineTextEditState.surfaceId,
      isInlineEditingNode,
    ],
  );

  const registerElement = (nodeId: number, element: HTMLElement | null) => {
    registerNodeElement(nodeId, element, surfaceId);
    divRef.current = element as HTMLDivElement | null;
  };

  const content = "content" in nodeRecord ? nodeRecord.content : undefined;
  const media = "media" in nodeRecord ? nodeRecord.media : undefined;
  const flushInlineEditorAndCommit = () => {
    if (inlineEditorRef.current) {
      const nextContent = extractPlainTextFromEditable(inlineEditorRef.current);
      updateInlineTextDraft(nextContent);
    }
    commitEditing();
  };

  useEffect(() => {
    if (!isInlineEditingNode || !inlineEditorRef.current || !inlineSessionKey) {
      appliedInlineSessionKeyRef.current = null;
      return;
    }
    if (appliedInlineSessionKeyRef.current === inlineSessionKey) return;
    appliedInlineSessionKeyRef.current = inlineSessionKey;
    writePlainTextToEditable(
      inlineEditorRef.current,
      inlineTextEditState.draftContent,
    );
    inlineEditorRef.current.focus();
    const pendingCaretPoint = pendingCaretPointRef.current;
    pendingCaretPointRef.current = null;
    if (
      pendingCaretPoint &&
      placeCaretAtPoint(inlineEditorRef.current, pendingCaretPoint)
    ) {
      return;
    }
    selectAllEditableText(inlineEditorRef.current);
  }, [
    inlineSessionKey,
    inlineTextEditState.draftContent,
    isInlineEditingNode,
  ]);

  useEffect(() => {
    if (!isInlineEditingNode || !inlineEditorRef.current) {
      return;
    }

    const editorElement = inlineEditorRef.current;
    const ownerDocument = editorElement.ownerDocument;
    const ownerWindow = ownerDocument.defaultView;
    const parentDocument =
      typeof document !== "undefined" && document !== ownerDocument
        ? document
        : null;

    const isInsideEditor = (target: EventTarget | null) => {
      if (!target) return false;
      if (target instanceof Node) {
        return editorElement.contains(target);
      }
      return false;
    };

    const commitIfOutsideEditor = (target: EventTarget | null) => {
      if (isInsideEditor(target)) return;
      flushInlineEditorAndCommit();
    };

    const handleOwnerPointerDown = (event: PointerEvent) => {
      commitIfOutsideEditor(event.target);
    };

    const handleParentPointerDown = (event: PointerEvent) => {
      commitIfOutsideEditor(event.target);
    };

    const handleWindowBlur = () => {
      flushInlineEditorAndCommit();
    };

    ownerDocument.addEventListener("pointerdown", handleOwnerPointerDown, true);
    parentDocument?.addEventListener("pointerdown", handleParentPointerDown, true);
    ownerWindow?.addEventListener("blur", handleWindowBlur);

    return () => {
      ownerDocument.removeEventListener(
        "pointerdown",
        handleOwnerPointerDown,
        true,
      );
      parentDocument?.removeEventListener(
        "pointerdown",
        handleParentPointerDown,
        true,
      );
      ownerWindow?.removeEventListener("blur", handleWindowBlur);
    };
  }, [commitEditing, isInlineEditingNode, inlineSessionKey]);

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
        if (isInlineEditingNode) {
          e.stopPropagation();
          setCanvasFocused(surfaceId);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        flushInlineEditorAndCommit();
        setCanvasFocused(surfaceId);
        dispatch(updateActiveNode({ id }));
      }}
      onDoubleClick={(e) => {
        if (!isInteractive) return;
        if (!isInlineEditableNode || !isContentNodeRecord(nodeRecord)) return;
        e.stopPropagation();
        pendingCaretPointRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
        setCanvasFocused(surfaceId);
        startEditing({
          nodeId: id,
          surfaceId,
          initialContent: nodeRecord.content,
        });
      }}
      onContextMenu={(e) => {
        if (isInlineEditingNode) {
          e.stopPropagation();
          setCanvasFocused(surfaceId);
          return;
        }
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
      isInlineEditing={isInlineEditingNode}
      inlineDraftContent={isInlineEditingNode ? inlineTextEditState.draftContent : undefined}
      inlineEditorRef={inlineEditorRef}
      onInlineInput={(e) => {
        const nextContent = extractPlainTextFromEditable(
          e.currentTarget as HTMLElement,
        );
        if (!isEditableEventTarget(e.target)) return;
        updateInlineTextDraft(nextContent);
      }}
      onInlineBlur={() => {
        flushInlineEditorAndCommit();
      }}
      onInlineKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          cancelEditing();
          return;
        }

        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          flushInlineEditorAndCommit();
          return;
        }

        if (e.key === "Tab") {
          flushInlineEditorAndCommit();
          return;
        }

        if (e.key !== "Enter") return;
        if (type === "core:paragraph" || type === "core:listItem") return;
        e.preventDefault();
        e.stopPropagation();
        flushInlineEditorAndCommit();
      }}
      onInlinePaste={(e) => {
        e.preventDefault();
        e.stopPropagation();
        insertPlainTextAtSelection(
          e.currentTarget as HTMLElement,
          e.clipboardData.getData("text/plain"),
        );
        const nextContent = extractPlainTextFromEditable(
          e.currentTarget as HTMLElement,
        );
        updateInlineTextDraft(nextContent);
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
