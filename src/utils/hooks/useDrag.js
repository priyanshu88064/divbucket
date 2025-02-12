import { useDispatch } from "react-redux";
import {
  addNode,
  deleteFromParent,
  updateActiveNode,
  updateDataMap,
  updateStyleMap,
} from "../../store/reducers/treeReducer";
import initCSS from "../initCSS";

export function useDrag({ id, _type }) {
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    // when any element drops here
    e.preventDefault();
    e.stopPropagation();

    let droppedId = Number(e.dataTransfer.getData("id"));
    const type = e.dataTransfer.getData("type");

    if (
      id === Number(droppedId) ||
      ["Heading", "Text", "Paragraph", "Image", "Video"].includes(_type)
    ) {
      return;
    }

    if (type.length) {
      dispatch(updateStyleMap({ id: droppedId, style: initCSS(type) }));
      dispatch(updateDataMap({ id: droppedId, data: { name: type, type } }));
    } else {
      dispatch(deleteFromParent({ id: droppedId }));
    }
    dispatch(addNode({ parent: id, child: droppedId }));
    dispatch(updateActiveNode({ id: droppedId }));
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
