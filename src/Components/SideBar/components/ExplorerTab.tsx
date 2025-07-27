import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import styles from "../sidebar.module.css";
import {
  addNode,
  moveItem,
  updateActiveNode,
  updateActiveTab,
} from "../../../store/reducers/treeReducer";
import { createTemplate } from "../../../utils/template";
import { VscNewFile } from "react-icons/vsc";
import { useContextMenu } from "../../../utils/hooks/useContextMenu";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { GetIconOfType } from "../../Cssbar/Cssbar";
import { FaFile } from "react-icons/fa";
import { GrDrag } from "react-icons/gr";
import ContextMenu from "../../ContextMenu/ContextMenu";

export default function Explorer() {
  const draggedNode = useRef<HTMLDivElement | null>(null);
  const dragWrapperRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const tabs = useSelector((state: RootState) => state.treeReducer.tree[-1]);
  const [newPage, setNewPage] = useState(false);
  const [newPageName, setNewPageName] = useState("My Page");

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    var dragWrapper = document.createElement("div");
    var dragImage = document.createElement("div");
    dragImage.innerText = (e.target as HTMLDivElement).innerText;
    dragWrapper.classList.add(styles.dragwrapper);
    dragImage.classList.add(styles.dragimage);
    dragWrapper.appendChild(dragImage);
    document.body.appendChild(dragWrapper);
    e.dataTransfer.setDragImage(dragImage, -10, -10);

    draggedNode.current = e.target as HTMLDivElement;
    dragWrapperRef.current = dragWrapper;
    (e.target as HTMLDivElement).classList.add(styles.removingitem);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(styles.removingitem);
    if (dragWrapperRef && dragWrapperRef.current)
      dragWrapperRef.current.remove();
    dragWrapperRef.current = null;
    draggedNode.current = null;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const targetNode = (e.target as HTMLDivElement).getAttribute("data-id");
    if (
      !draggedNode.current ||
      !targetNode ||
      targetNode === draggedNode.current.getAttribute("data-id")
    )
      return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const diff = e.clientY - rect.top;
    if (!tabs.includes(Number(targetNode)) && diff <= rect.height / 3) {
      (e.target as HTMLDivElement).classList.remove(
        styles.dragbottom,
        styles.dragmiddle,
      );
      (e.target as HTMLDivElement).classList.add(styles.dragtop);
    } else if (diff <= (rect.height * 2) / 3) {
      (e.target as HTMLDivElement).classList.remove(
        styles.dragbottom,
        styles.dragtop,
      );
      (e.target as HTMLDivElement).classList.add(styles.dragmiddle);
    } else {
      (e.target as HTMLDivElement).classList.remove(
        styles.dragtop,
        styles.dragmiddle,
      );
      (e.target as HTMLDivElement).classList.add(styles.dragbottom);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggedNode.current) return;
    (e.target as HTMLDivElement).classList.remove(
      styles.dragtop,
      styles.dragmiddle,
      styles.dragbottom,
    );
    const targetNode = (e.target as HTMLDivElement).getAttribute("data-id");
    const _draggedNode = draggedNode.current.getAttribute("data-id");
    if (!targetNode || targetNode === _draggedNode) return;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const diff = e.clientY - rect.top;
    if (!tabs.includes(Number(targetNode)) && diff <= rect.height / 3) {
      dispatch(
        moveItem({ node: _draggedNode, referenceNode: targetNode, pos: 0 }),
      );
    } else if (diff <= (rect.height * 2) / 3) {
      dispatch(
        moveItem({ node: _draggedNode, referenceNode: targetNode, pos: -1 }),
      );
    } else {
      dispatch(
        moveItem({ node: _draggedNode, referenceNode: targetNode, pos: 1 }),
      );
    }
    if (dragWrapperRef && dragWrapperRef.current)
      dragWrapperRef.current.remove();
    dragWrapperRef.current = null;
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(
      styles.dragtop,
      styles.dragmiddle,
      styles.dragbottom,
    );
  };
  const handleAddPage = () => {
    if (!newPageName.length) return;
    setNewPage(false);
    setNewPageName("My Page");
    const child = createTemplate({ type: "Tab", name: newPageName, dispatch });
    dispatch(addNode({ parent: -1, child }));
    dispatch(updateActiveTab({ tab: child }));
  };

  return (
    <>
      <div className={`${styles.head} ${styles.exp}`}>
        <div>EXPLORER</div>
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

const RLItem = ({
  node,
  pleft,
  myTab,
}: {
  node: number;
  pleft: number;
  myTab: number;
}) => {
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].type,
  );
  const unit = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].unit,
  );
  const [active, setActive] = useState(true);
  const activeNodeId = useSelector(
    (state: RootState) => state.treeReducer.activeNodeId,
  );
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
  const name = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].name,
  );
  const { clicked, setClicked, points, setPoints } = useContextMenu();
  const dispatch = useDispatch();

  return (
    <div className={styles.rlistitem}>
      <div
        data-id={node}
        draggable={type !== "root"}
        style={{ paddingLeft: pleft + "px" }}
        className={`${styles.rliwrap} ${activeNodeId === node ? styles.activeItemClass : ""} ${unit && styles.redrag}`}
        onClick={() => {
          if (myTab !== activeTab) dispatch(updateActiveTab({ tab: myTab }));
          if (activeNodeId !== node) dispatch(updateActiveNode({ id: node }));
        }}
        onDoubleClick={() => setActive((f) => !f)}
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
          setPoints({ x: e.pageX, y: e.pageY });
          dispatch(updateActiveNode({ id: node }));
        }}
      >
        <div
          className={styles.rli0}
          onClick={() => {
            setActive((f) => !f);
          }}
        >
          {!unit ? (
            active ? (
              <MdKeyboardArrowDown size={17} color="var(--text_0)" />
            ) : (
              <MdKeyboardArrowRight size={17} color="var(--text_0)" />
            )
          ) : (
            <MdKeyboardArrowRight size={17} color="transparent" />
          )}
        </div>
        <div
          onClick={() => {
            setActive((f) => !f);
          }}
          className={styles.rli0}
        >
          {GetIconOfType(type)}
          {name}
        </div>
        <div className={`${styles.grdrag} ${type === "root" && styles.grshow}`}>
          {type === "root" ? <FaFile /> : <GrDrag />}
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
      {active && (
        <RecursiveList start={node} pleft={pleft + 10} myTab={myTab} />
      )}
    </div>
  );
};

const RecursiveList = ({
  start,
  pleft,
  myTab,
}: {
  start: number;
  pleft: number;
  myTab: number;
}) => {
  const tree = useSelector((state: RootState) => state.treeReducer.tree);

  return (
    <>
      {tree[start].map((node) => (
        <RLItem key={node} node={node} pleft={pleft} myTab={myTab} />
      ))}
    </>
  );
};
