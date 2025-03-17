import { addTemplate } from "../store/reducers/treeReducer";
import initCSS from "./initCSS";
import initData from "./initData";

const TYPES = {
  form: {
    tree: { 0: [1, 2], 1: [], 2: [] },
    styleMap: {
      0: { display: "flex" },
      1: { margin: "2px" },
      2: { width: "none" },
    },
    dataMap: {
      0: { name: "form", type: "form" },
      1: { name: "ss", type: "ss" },
      2: { name: "ff", type: "ff" },
    },
  },
  Block: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Block") },
    dataMap: { 0: initData("Block") },
  },
  Row: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Row") },
    dataMap: { 0: initData("Row") },
  },
  Heading: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Heading") },
    dataMap: { 0: initData("Heading") },
  },
  Text: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Text") },
    dataMap: { 0: initData("Text") },
  },
  Paragraph: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Paragraph") },
    dataMap: { 0: initData("Paragraph") },
  },
  Image: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Image") },
    dataMap: { 0: initData("Image") },
  },
  Video: {
    tree: { 0: [] },
    styleMap: { 0: initCSS("Video") },
    dataMap: { 0: initData("Video") },
  },
};

export const createTemplate = (type, dispatch) => {
  if (!Object.keys(TYPES).includes(type)) return;
  let tree = {},
    dataMap = {},
    styleMap = {};
  const createCopy = (id, obj) => {
    const uid = Math.floor(Math.random() * 1000000);
    dataMap[uid] = obj.dataMap[id];
    styleMap[uid] = obj.styleMap[id];
    tree[uid] = obj.tree[id].map((node) => createCopy(node, obj));
    return uid;
  };
  const rootId = createCopy(0, TYPES[type]);
  dispatch(addTemplate({ tree, dataMap, styleMap }));
  return rootId;
};
