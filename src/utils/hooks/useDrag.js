import { useDispatch, useSelector } from "react-redux";
import {
  deleteNode,
  updateDataMap,
  updateStyleMap,
  updateTree,
} from "../../store/reducers/treeReducer";
import initCSS from "../initCSS";

export function useDrag({ id }) {
  const { tree } = useSelector((state) => state.treeReducer);
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    // when any element drops here
    e.preventDefault();
    e.stopPropagation();
    const droppedId = e.dataTransfer.getData("id");
    if (id == droppedId) return;
    dispatch(deleteNode({ id:Number(droppedId) }));
    // dispatch(updateTree({tree:{...tree,[id]:[...tree[id],droppedId]}}))

  };
  const handleDragOver = (e) => {
    // when any elements drag on this resizable
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragStart = (e) => {
    // when this resizable starts dragging
    e.stopPropagation();
    var img = document.createElement("img");
    img.src = "";
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setData("id", id);
  };
  const handleDragEnter = (e) => {
    e.stopPropagation();
  };
  const handleDragLeave = (e) => {
    e.stopPropagation();
  };

  return {
    handleDrop,
    handleDragOver,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
  };
}
