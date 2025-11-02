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
TYPES.Video = {
  tree: { 0: [] },
  styleMap: { 0: { default: initCSS("Video"), hover: {}, active: {} } },
  dataMap: { 0: initData("Video") },
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
      media: {
        src: "https://img.logoipsum.com/350.svg",
      },
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
      content: "Button",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
  },
};

TYPES.Card = {
  tree: {
    "0": [1, 2, 3, 4],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
  },
  styleMap: {
    "1": {
      default: {
        backgroundColor: "#1163ff",
        borderRadius: "8px",
        translate: "0 -32px",
        boxShadow: "0 1px 3px #000000",
        height: "100px",
      },
      hover: {},
      active: {},
    },
    "2": {
      default: {
        fontWeight: "bold",
        color: "#393939",
      },
      hover: {},
      active: {},
    },
    "3": {
      default: {
        fontSize: "14px",
        marginTop: "8px",
        color: "#3d3d3d",
      },
      hover: {},
      active: {},
    },
    "0": {
      default: {
        width: "255px",
        boxShadow: "0 1px 3px #000000",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "16px",
        paddingBottom: "16px",
        paddingRight: "16px",
      },
      hover: {},
      active: {},
    },
    "4": {
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
        fontSize: "12px",
        marginTop: "32px",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    "1": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "2": {
      name: "Text",
      type: "Text",
      content: "Heading Card",
      unit: true,
    },
    "3": {
      name: "Paragraph",
      type: "Paragraph",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
      unit: true,
    },
    "0": {
      name: "Card",
      type: "Block",
      content: null,
      unit: false,
    },
    "4": {
      name: "Button",
      type: "Button",
      content: "Read More",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
  },
};

TYPES.Hero = {
  tree: {
    "3": [4, 5],
    "4": [],
    "2": [],
    "1": [],
    "0": [1, 2, 3],
    "5": [],
  },
  styleMap: {
    "3": {
      default: {
        gap: "48px",
        marginTop: "24px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      hover: {},
      active: {},
    },
    "4": {
      default: {
        width: "fit-content",
        paddingTop: "8px",
        paddingRight: "16px",
        paddingLeft: "16px",
        paddingBottom: "8px",
        backgroundColor: "#8b3a00",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    "2": {
      default: {
        fontSize: "14px",
        marginTop: "24px",
        textAlign: "justify",
        maxWidth: "800px",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      hover: {},
      active: {},
    },
    "1": {
      default: {
        width: "fit-content",
        fontSize: "32px",
        fontWeight: "bolder",
      },
      hover: {},
      active: {},
    },
    "0": {
      default: {
        height: "600px",
        backgroundImage: "url(https://picsum.photos/id/117/1920/1080)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      hover: {},
      active: {},
    },
    "5": {
      default: {
        width: "fit-content",
        paddingTop: "8px",
        paddingRight: "16px",
        paddingLeft: "16px",
        paddingBottom: "8px",
        backgroundColor: "#8b3a00",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    "3": {
      name: "Row",
      type: "Row",
      content: null,
      unit: false,
    },
    "4": {
      name: "Button",
      type: "Button",
      content: "Read more",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "2": {
      name: "Paragraph",
      type: "Paragraph",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      unit: true,
    },
    "1": {
      name: "Text",
      type: "Text",
      content: "HERO SECTION",
      unit: true,
    },
    "0": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "URL",
      },
    },
    "5": {
      name: "Button",
      type: "Button",
      content: "This is hero section",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
  },
};

TYPES.Feature = {
  tree: {
    "39640": [],
    "81116": [611990, 94673, 195969],
    "94673": [],
    "152324": [],
    "181050": [],
    "195969": [],
    "216838": [],
    "317816": [],
    "479732": [711696, 752926, 998573],
    "533899": [],
    "611990": [],
    "0": [979227, 216838, 963823],
    "711696": [],
    "752926": [],
    "761784": [39640, 181050, 533899],
    "762069": [859081, 152324, 317816],
    "859081": [],
    "963823": [81116, 762069, 761784, 479732],
    "979227": [],
    "998573": [],
  },
  styleMap: {
    "39640": {
      default: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "#424242",
        fontSize: "12px",
        height: "18px",
      },
      hover: {},
      active: {},
    },
    "81116": {
      default: {
        borderRadius: "24px",
        backgroundColor: "#E2F8DF",
        paddingLeft: "16px",
        paddingRight: "16px",
        flexDirection: "column",
        justifyContent: "center",
        display: "flex",
        paddingTop: "48px",
        paddingBottom: "48px",
      },
      hover: {},
      active: {},
    },
    "94673": {
      default: {
        fontWeight: "600",
        marginTop: "12px",
        width: "318px",
      },
      hover: {},
      active: {},
    },
    "152324": {
      default: {
        fontWeight: "600",
        marginTop: "12px",
        width: "318px",
      },
      hover: {},
      active: {},
    },
    "181050": {
      default: {
        fontWeight: "600",
        marginTop: "12px",
        width: "318px",
      },
      hover: {},
      active: {},
    },
    "195969": {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "10px",
        marginTop: "32px",
        height: "21px",
      },
      hover: {},
      active: {},
    },
    "216838": {
      default: {
        width: "90%",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "24px",
        fontSize: "12px",
        textAlign: "center",
      },
      hover: {},
      active: {},
    },
    "317816": {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "10px",
        marginTop: "32px",
        height: "21px",
      },
      hover: {},
      active: {},
    },
    "479732": {
      default: {
        borderRadius: "24px",
        backgroundColor: "#DFF5F7",
        paddingLeft: "16px",
        paddingRight: "16px",
        flexDirection: "column",
        justifyContent: "center",
        display: "flex",
        flexWrap: "nowrap",
        paddingTop: "48px",
        paddingBottom: "48px",
        marginTop: "24px",
      },
      hover: {},
      active: {},
    },
    "533899": {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "10px",
        marginTop: "32px",
        height: "21px",
      },
      hover: {},
      active: {},
    },
    "611990": {
      default: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "#424242",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    "0": {
      default: {
        paddingTop: "48px",
        paddingBottom: "48px",
      },
      hover: {},
      active: {},
    },
    "711696": {
      default: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "#424242",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    "752926": {
      default: {
        fontWeight: "600",
        marginTop: "12px",
        width: "318px",
      },
      hover: {},
      active: {},
    },
    "761784": {
      default: {
        borderRadius: "24px",
        backgroundColor: "#F2E9F8",
        paddingLeft: "16px",
        paddingRight: "16px",
        flexDirection: "column",
        justifyContent: "center",
        display: "flex",
        flexWrap: "nowrap",
        paddingTop: "48px",
        paddingBottom: "48px",
        marginTop: "24px",
      },
      hover: {},
      active: {},
    },
    "762069": {
      default: {
        borderRadius: "24px",
        backgroundColor: "#FEF2C1",
        paddingLeft: "16px",
        paddingRight: "16px",
        flexDirection: "column",
        justifyContent: "center",
        display: "flex",
        paddingTop: "48px",
        paddingBottom: "48px",
      },
      hover: {},
      active: {},
    },
    "859081": {
      default: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "#424242",
        fontSize: "12px",
      },
      hover: {},
      active: {},
    },
    "963823": {
      default: {
        display: "flex",
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingRight: "16px",
        paddingLeft: "16px",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "24px",
      },
      hover: {},
      active: {},
    },
    "979227": {
      default: {
        textAlign: "center",
        width: "90%",
        fontSize: "24px",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        fontWeight: "bold",
        fontVariant: "small-caps",
      },
      hover: {},
      active: {},
    },
    "998573": {
      default: {
        width: "fit-content",
        paddingTop: "4px",
        paddingRight: "8px",
        paddingLeft: "8px",
        paddingBottom: "4px",
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "10px",
        marginTop: "32px",
        height: "21px",
      },
      hover: {},
      active: {},
    },
  },
  dataMap: {
    "39640": {
      name: "Text",
      type: "Text",
      content: "Style as you want",
      unit: true,
    },
    "81116": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "94673": {
      name: "Paragraph",
      type: "Paragraph",
      content: "Move stuff around by clicking and start dragging",
      unit: true,
    },
    "152324": {
      name: "Paragraph",
      type: "Paragraph",
      content: "Easy to edit pre-built layout and sections.",
      unit: true,
    },
    "181050": {
      name: "Paragraph",
      type: "Paragraph",
      content: "Play around with css styles, make section anyhow you want",
      unit: true,
    },
    "195969": {
      name: "Button",
      type: "Button",
      content: "Start creating today",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "216838": {
      name: "Paragraph",
      type: "Paragraph",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      unit: true,
    },
    "317816": {
      name: "Button",
      type: "Button",
      content: "What are you waiting for",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "479732": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "533899": {
      name: "Button",
      type: "Button",
      content: "Checkout styles properties",
      unit: true,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "611990": {
      name: "Text",
      type: "Text",
      content: "Drag n Drop",
      unit: true,
    },
    "0": {
      name: "Feature",
      type: "Block",
      content: null,
      unit: false,
    },
    "711696": {
      name: "Text",
      type: "Text",
      content: "Drag n Drop",
      unit: true,
    },
    "752926": {
      name: "Paragraph",
      type: "Paragraph",
      content: "Move stuff around by clicking and start dragging",
      unit: true,
    },
    "761784": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "762069": {
      name: "Block",
      type: "Block",
      content: null,
      unit: false,
      cssData: {
        backgroundType: "Solid",
      },
    },
    "859081": {
      name: "Text",
      type: "Text",
      content: "Layouts and Sections ",
      unit: true,
    },
    "963823": {
      name: "Row",
      type: "Row",
      content: null,
      unit: false,
    },
    "979227": {
      name: "Text",
      type: "Text",
      content:
        "Develop, build and visualize your dream website - only sky is the limit",
      unit: true,
    },
    "998573": {
      name: "Button",
      type: "Button",
      content: "Start creating today ",
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
