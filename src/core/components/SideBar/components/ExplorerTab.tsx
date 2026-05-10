import { memo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@core/state/store";
import styles from "../sidebar.module.css";
import {
  addNode,
  moveNode,
  updateActiveNode,
  updateActivePageId,
} from "@core/state/reducers/treeReducer";
import { createTemplate } from "@core/utils/template";
import { editorRegistry } from "@core/kernel/bootstrap";
import { VscNewFile } from "react-icons/vsc";
import { useContextMenu } from "@core/hooks/useContextMenu";
import { GetIconOfType } from "../../Cssbar/Cssbar";
import { FaFile } from "react-icons/fa";
import { GrDrag } from "react-icons/gr";
import ContextMenu from "../../Overlays/ContextMenu/ContextMenu";
import { GoChevronDown, GoChevronRight } from "react-icons/go";
import {
  canPlaceChildKindAtTarget,
  isNodeKindContainer,
} from "@core/editor/constraints";
import { resolveExplorerPlacement } from "@core/editor/dragPlacement";
import type { EditorPlacement } from "@core/editor/types";
import {
  selectActiveNodeId,
  selectActivePageId,
  selectDocumentState,
  selectNodeChildrenById,
  selectNodeRecordById,
  selectTabs,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export default function Explorer() {
  useRenderCounter("ExplorerTab");
  const draggedNode = useRef<HTMLDivElement | null>(null);
  const dragWrapperRef = useRef<HTMLDivElement | null>(null);
  const dragPlacementRef = useRef<EditorPlacement>("after");
  const dragTargetRef = useRef<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const treeState = useSelector(selectDocumentState);
  const tabs = useSelector(selectTabs);
  const [newPage, setNewPage] = useState(false);
  const [newPageName, setNewPageName] = useState("Untitled");

  const clearDragClasses = (element: HTMLElement | null) => {
    if (!element) return;
    element.classList.remove(
      styles.dragtop,
      styles.dragmiddle,
      styles.dragbottom,
    );
  };

  const setDragClass = (element: HTMLElement, placement: EditorPlacement) => {
    clearDragClasses(element);
    if (placement === "before") {
      element.classList.add(styles.dragtop);
      return;
    }
    if (placement === "inside") {
      element.classList.add(styles.dragmiddle);
      return;
    }
    element.classList.add(styles.dragbottom);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLDivElement | null;
    if (!target) return;

    const dragWrapper = document.createElement("div");
    const dragImage = document.createElement("div");
    dragImage.innerText = target.innerText;
    dragWrapper.classList.add(styles.dragwrapper);
    dragImage.classList.add(styles.dragimage);
    dragWrapper.appendChild(dragImage);
    document.body.appendChild(dragWrapper);
    e.dataTransfer.setDragImage(dragImage, -10, -10);

    draggedNode.current = target;
    dragWrapperRef.current = dragWrapper;
    target.classList.add(styles.removingitem);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLDivElement | null;
    if (target) target.classList.remove(styles.removingitem);
    if (dragWrapperRef && dragWrapperRef.current)
      dragWrapperRef.current.remove();
    dragWrapperRef.current = null;
    dragTargetRef.current = null;
    draggedNode.current = null;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const targetElement = (e.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLDivElement | null;
    const targetNode = targetElement?.getAttribute("data-id");
    const draggedNodeId = draggedNode.current?.getAttribute("data-id");
    const draggedType = draggedNodeId
      ? treeState.nodeRecordMap[Number(draggedNodeId)]?.type
      : null;
    if (
      !draggedNode.current ||
      !targetElement ||
      !targetNode ||
      !draggedType ||
      targetNode === draggedNode.current.getAttribute("data-id")
    )
      return;
    const rect = targetElement.getBoundingClientRect();
    const targetId = Number(targetNode);
    const canDropInside = canPlaceChildKindAtTarget({
      state: treeState,
      childKind: draggedType,
      target: {
        referenceNodeId: targetId,
        placement: "inside",
      },
    });
    const placement = resolveExplorerPlacement({
      y: e.clientY,
      rect,
      canDropInside,
    });

    if (
      !canPlaceChildKindAtTarget({
        state: treeState,
        childKind: draggedType,
        target: {
          referenceNodeId: targetId,
          placement,
        },
      })
    ) {
      clearDragClasses(targetElement);
      dragTargetRef.current = null;
      return;
    }

    dragPlacementRef.current = placement;
    dragTargetRef.current = targetId;
    setDragClass(targetElement, placement);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggedNode.current) return;
    const targetElement = (e.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLDivElement | null;
    if (targetElement) clearDragClasses(targetElement);
    const draggedId = draggedNode.current.getAttribute("data-id");
    if (!draggedId || dragTargetRef.current === null) return;

    if (Number(draggedId) !== dragTargetRef.current) {
      dispatch(
        moveNode({
          node: Number(draggedId),
          target: {
            referenceNodeId: dragTargetRef.current,
            placement: dragPlacementRef.current,
          },
        }),
      );
    }

    if (dragWrapperRef && dragWrapperRef.current)
      dragWrapperRef.current.remove();
    dragWrapperRef.current = null;
    dragTargetRef.current = null;
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const targetElement = (e.target as HTMLElement).closest(
      "[data-id]",
    ) as HTMLDivElement | null;
    clearDragClasses(targetElement);
  };
  const handleAddPage = () => {
    if (!newPageName.length) return;
    setNewPage(false);
    setNewPageName("Untitled");
    const child = createTemplate({
      type: "core:page",
      name: newPageName,
      dispatch,
      treeState,
      registry: editorRegistry,
    });
    dispatch(addNode({ parent: -1, child }));
    dispatch(updateActivePageId({ pageId: child }));
  };

  return (
    <>
      <div className={`${styles.head} ${styles.exp}`}>
        <div className="text-xs">EXPLORER</div>
        <div
          title="add page"
          style={{ cursor: "pointer" }}
          onClick={() => setNewPage((f) => !f)}
        >
          <VscNewFile size={15} color="white" />
        </div>
      </div>
      <div
        className={styles.rlist}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {newPage && (
          <div className={styles.newpage}>
            <input
              size={5}
              value={newPageName}
              onFocus={(e) => e.target.select()}
              type="text"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleAddPage();
                }
              }}
              onChange={(e) => {
                setNewPageName(e.target.value);
              }}
            />
            <div onClick={() => handleAddPage()}>Add Page</div>
          </div>
        )}
        {tabs.map((tab, ind) => (
          <RLItem key={tab + ind + ""} node={tab} pleft={5} myTab={tab} />
        ))}
      </div>
    </>
  );
}

const RLItem = memo(function RLItem({
  node,
  pleft,
  myTab,
}: {
  node: number;
  pleft: number;
  myTab: number;
}) {
  useRenderCounter("ExplorerRow");
  const type = useSelector(
    (state: RootState) => selectNodeRecordById(state, node)?.type,
  );
  const safeType = type || "core:container";
  const isLeaf = !isNodeKindContainer(safeType);
  const [active, setActive] = useState(false);
  const activeNodeId = useSelector(selectActiveNodeId);
  const activePageId = useSelector(selectActivePageId);
  const name = useSelector(
    (state: RootState) => selectNodeRecordById(state, node)?.name,
  );
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const dispatch = useDispatch();

  return (
    <div className="text-xs">
      <div
        data-id={node}
        draggable={safeType !== "core:root"}
        style={{ paddingLeft: pleft + "px" }}
        className={`
          group relative flex items-center hover:bg-[#333C46] border
          ${activeNodeId === node ? "bg-[#333C46] border-gray-400" : "border-transparent"} ${isLeaf && styles.redrag}
        `}
        onClick={() => {
          setActive((f) => !f);
          if (myTab !== activePageId)
            dispatch(updateActivePageId({ pageId: myTab }));
          if (activeNodeId !== node) dispatch(updateActiveNode({ id: node }));
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
          setPoints({ x: e.pageX, y: e.pageY });
          if (myTab !== activePageId)
            dispatch(updateActivePageId({ pageId: myTab }));
          if (activeNodeId !== node) dispatch(updateActiveNode({ id: node }));
        }}
      >
        <div className="py-[3px] flex items-center gap-1 text-[var(--text_0)]">
          <div className="w-4">
            {isLeaf ? (
              <div className="pl-[2px]">{GetIconOfType(safeType)}</div>
            ) : active ? (
              <GoChevronDown size={17} />
            ) : (
              <GoChevronRight size={17} />
            )}
          </div>
          {name}
        </div>
        <div
          className={`
            group-hover:flex ml-auto mr-[10px] cursor-move
            ${safeType === "core:root" ? "flex text-[var(--text_0)]" : "hidden"}
          `}
        >
          {safeType === "core:root" ? <FaFile /> : <GrDrag />}
        </div>
        {clicked && (
          <ContextMenu
            id={node}
            points={points}
            sidebar={true}
            setClicked={setClicked}
          />
        )}
      </div>
      <div className="relative">
        <div
          style={{ left: pleft + 8 + "px" }}
          className={`absolute h-full border-l border-gray-600 w-[1px]`}
        ></div>
        {active && (
          <RecursiveList start={node} pleft={pleft + 10} myTab={myTab} />
        )}
      </div>
    </div>
  );
});

const RecursiveList = memo(function RecursiveList({
  start,
  pleft,
  myTab,
}: {
  start: number;
  pleft: number;
  myTab: number;
}) {
  const children = useSelector((state: RootState) =>
    selectNodeChildrenById(state, start),
  );

  return (
    <>
      {children.map((node) => (
        <RLItem key={node} node={node} pleft={pleft} myTab={myTab} />
      ))}
    </>
  );
});
