import { useDispatch } from "react-redux";
import {
  addNode,
  deleteFromParent,
  deleteNode,
  updateActiveNode,
  updateDataMap,
  updateStyleMap,
} from "../../store/reducers/treeReducer";
import { useState } from "react";
import initCSS from "../initCSS";

export function useDrag({ id }) {
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    // when any element drops here
    e.preventDefault();
    e.stopPropagation();

    const droppedId = e.dataTransfer.getData("id");
    const type = e.dataTransfer.getData("type");

    if (id == droppedId) return;
    if (type.length) {
      dispatch(updateStyleMap({ id: Number(droppedId), style: initCSS(type) }));
      dispatch(updateDataMap({ id: Number(droppedId), data: { name: type, type } }));
    } else {
      dispatch(deleteFromParent({ id: Number(droppedId) }));
    }
    dispatch(addNode({ parent: id, child: Number(droppedId) }));
    dispatch(updateActiveNode({ id: Number(droppedId) }));
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
