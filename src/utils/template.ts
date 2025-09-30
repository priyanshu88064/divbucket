import { addTemplate } from "../store/reducers/treeReducer";
import type { AppDispatch } from "../store/store";
import type { Template, TemplateGroup } from "../types/Template";
import type { NodeData, NodeStyle, Tree } from "../types/Tree";
import initCSS from "./initCSS";
import initData from "./initData";

let TYPES: TemplateGroup = {};

TYPES.Tab = {
  tree: { 0: [] },
  styleMap: {
    0: {
      default: {
        width: "100%",
        height: "100%",
        minWidth: "350px",
        background: "white",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingBottom: "5px",
        paddingLeft: "5px",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    0: {
      type: "root",
      name: "newTab",
      unit: false,
      open: true,
    },
  },
};
TYPES.Block = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Block"), hover: {}, active: {} } },
  dataMap: { 0: initData("Block") },
};
TYPES.Row = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Row"), hover: {}, active: {} } },
  dataMap: { 0: initData("Row") },
};
TYPES.Heading = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Heading"), hover: {}, active: {} } },
  dataMap: { 0: initData("Heading") },
};
TYPES.Text = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Text"), hover: {}, active: {} } },
  dataMap: { 0: initData("Text") },
};
TYPES.Paragraph = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Paragraph"), hover: {}, active: {} } },
  dataMap: { 0: initData("Paragraph") },
};
TYPES.Image = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Image"), hover: {}, active: {} } },
  dataMap: { 0: initData("Image") },
};
TYPES.ListItem = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Text"), hover: {}, active: {} } },
  dataMap: {
    0: { ...initData("Text"), name: "LItem", content: "• List Item" },
  },
};
TYPES.List = {
  tree: { 0: [1, 2, 3, 4], 1: [], 2: [], 3: [], 4: [] },
  styleMap: {
    0: {
      default: {
        ...TYPES.Block.styleMap[0],
        height: "auto",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
      },
      hover: {},
      active: {},
    },
    1: TYPES.ListItem.styleMap[0],
    2: TYPES.ListItem.styleMap[0],
    3: TYPES.ListItem.styleMap[0],
    4: TYPES.ListItem.styleMap[0],
  },
  dataMap: {
    0: { ...TYPES.Block.dataMap[0], name: "List" },
    1: TYPES.ListItem.dataMap[0],
    2: TYPES.ListItem.dataMap[0],
    3: TYPES.ListItem.dataMap[0],
    4: TYPES.ListItem.dataMap[0],
  },
};
TYPES.Navbar = {
  tree: { 0: [1, 2], 1: [], 2: [3, 4, 5, 6], 3: [], 4: [], 5: [], 6: [] },
  styleMap: {
    0: {
      default: {
        ...TYPES.Row.styleMap[0],
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        gap: "20px",
        justifyContent: "space-between",
        borderStyle: "Solid",
        borderColor: "gray",
        borderRadius: "5px",
        borderWidth: "1px",
        alignItems: "center",
      },
      hover: {},
      active: {},
    },
    1: TYPES.Image.styleMap[0],
    2: {
      default: {
        ...TYPES.Row.styleMap[0].default,
        gap: "50px",
        minHeight: "0",
      },
      hover: {},
      active: {},
    },
    3: {
      default: {
        ...TYPES.Text.styleMap[0].default,
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    4: {
      default: {
        ...TYPES.Text.styleMap[0].default,
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    5: {
      default: {
        ...TYPES.Text.styleMap[0].default,
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    6: {
      default: {
        ...TYPES.Text.styleMap[0].default,
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    0: {
      ...TYPES.Row.dataMap[0],
      name: "Navbar",
    },
    1: {
      ...TYPES.Image.dataMap[0],
      src: "https://img.logoipsum.com/350.svg",
    },
    2: {
      ...TYPES.Row.dataMap[0],
    },
    3: {
      ...TYPES.Text.dataMap[0],
      content: "Home",
    },
    4: {
      ...TYPES.Text.dataMap[0],
      content: "Gallery",
    },
    5: {
      ...TYPES.Text.dataMap[0],
      content: "About Us",
    },
    6: {
      ...TYPES.Text.dataMap[0],
      content: "Contact Us",
    },
  },
};

TYPES.Button = {
  tree: { 0: [] },
  styleMap: {
    0: {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#1163ff",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    0: {
      name: "Button",
      type: "Button",
      hyperlink: "",
      newTab: false,
      src: "",
      alt: "",
      content: "Button",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
  },
};

export const createTemplate = ({
  type,
  dispatch,
  name,
}: {
  type: string;
  dispatch: AppDispatch;
  name?: string;
}) => {
  if (!Object.keys(TYPES).includes(type)) {
    throw new Error("");
  }
  let tree: Tree = {};
  let dataMap: NodeData = {};
  let styleMap: NodeStyle = {};
  const createCopy = (id: number, obj: Template) => {
    const uid = Math.floor(Math.random() * 1000000);
    dataMap[uid] = obj.dataMap[id];
    styleMap[uid] = obj.styleMap[id];
    tree[uid] = obj.tree[id].map((node) => createCopy(node, obj));
    return uid;
  };
  const rootId = createCopy(0, TYPES[type]);
  if (name && name.length) dataMap[rootId] = { ...dataMap[rootId], name };
  dispatch(addTemplate({ tree, dataMap, styleMap }));
  return rootId;
};
