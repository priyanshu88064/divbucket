import { useDispatch, useSelector } from "react-redux";
import {
  addNode,
  deleteFromParent,
  updateActiveNode,
  updateDataMap,
  updateStyleMap,
} from "../../store/reducers/treeReducer";
import initCSS from "../initCSS";
import initData from "../initData";

export function useDrag({ id }) {
  const dispatch = useDispatch();
  const tree = useSelector((state) => state.treeReducer.tree);
  const _type = useSelector((state) => state.treeReducer.dataMap[id].type);

  const isRelation = ({ parent, child }) => {
    if (!tree[parent]) return false;
    if (tree[parent].includes(child)) return true;
    for (const _child of tree[parent]) {
      if (isRelation({ parent: _child, child })) return true;
    }
    return false;
  };

  const handleDrop = (e) => {
    // when any element drops here
    e.preventDefault();
    e.stopPropagation();

    let droppedId = Number(e.dataTransfer.getData("id"));
    const type = e.dataTransfer.getData("type");

    if (
      id === Number(droppedId) ||
      ["Heading", "Text", "Paragraph", "Image", "Video"].includes(_type) ||
      isRelation({ parent: droppedId, child: id })
    ) {
      return;
    }

    if (type.length) {
      dispatch(updateStyleMap({ id: droppedId, style: initCSS(type) }));
      dispatch(updateDataMap({ id: droppedId, data: initData(type) }));
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
