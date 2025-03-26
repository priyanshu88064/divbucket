import { createSlice } from "@reduxjs/toolkit";

const createCopy = (id, state) => {
  const uid = Math.floor(Math.random() * 1000000);
  state.styleMap[uid] = state.styleMap[id];
  state.dataMap[uid] = state.dataMap[id];
  state.tree[uid] = state.tree[id].map((_id) => createCopy(_id, state));
  return uid;
};

const getParent = (tree, start, id) => {
  if (tree[start].includes(id)) return start;
  for (const node of tree[start]) {
    const result = getParent(tree, node, id);
    if (result) return result;
  }
  return null;
};

const isRelation = ({ tree, parent, child }) => {
  if (!tree[parent]) return false;
  if (tree[parent].includes(child)) return true;
  for (const _child of tree[parent]) {
    if (isRelation({ tree, parent: _child, child })) return true;
  }
  return false;
};

const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: {
      3575: [962312],
      11706: [],
      24406: [25382],
      25382: [],
      43105: [310869, 787484],
      59187: [],
      77336: [],
      91049: [],
      91625: [],
      117400: [968581],
      126765: [3575, 43105, 782343],
      140244: [659389],
      196229: [356969],
      208325: [],
      227285: [374152, 920177],
      258949: [208325],
      272644: [77336, 576277],
      310869: [373040],
      319269: [799522, 832427, 117400],
      348806: [272644, 900318],
      352908: [968176, 196229],
      356969: [],
      359031: [],
      373040: [],
      374152: [468371],
      405318: [140244, 799609],
      412282: [],
      441882: [],
      468371: [],
      487938: [],
      519402: [936675, 24406],
      576277: [],
      579774: [],
      607585: [],
      659389: [],
      690009: [258949, 126765],
      712436: [],
      741342: [],
      743391: [],
      782343: [607585],
      787484: [850899],
      799522: [441882, 348806],
      799609: [487938],
      832427: [412282, 91049, 91625],
      850899: [],
      881404: [712436, 743391],
      900318: [],
      920177: [11706],
      936385: [881404, 579774, 227285, 352908, 690009, 59187, 359031],
      936675: [741342],
      945829: [],
      962312: [],
      968176: [405318, 519402],
      968581: [],
      tabs: [936385, 319269],
    },
    activeNodeId: 936385,
    activeTab: 936385,
    styleMap: {
      3575: {},
      11706: {
        width: "334px",
        height: "fit-content",
      },
      24406: {
        minHeight: "20px",
        height: "96px",
        background: "#C68EFD",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      25382: {
        color: "#3b3b3b",
      },
      43105: {
        minHeight: "20px",
        display: "flex",
        height: "189px",
        gap: "10px",
      },
      59187: {
        paddingLeft: "100px",
        paddingRight: "100px",
        marginBottom: "0",
        fontSize: "12px",
        color: "#454545",
      },
      77336: {
        fontSize: "16px",
        color: "#4a4a4a",
        fontWeight: "bold",
      },
      91049: {
        color: "#303030",
        marginTop: "20px",
      },
      91625: {
        color: "#303030",
        marginTop: "20px",
      },
      117400: {
        minHeight: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
      },
      126765: {
        minHeight: "20px",
        width: "247px",
        flexDirection: "column",
      },
      140244: {
        minHeight: "20px",
        height: "96px",
        background: "#E9A5F1",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      196229: {
        minHeight: "20px",
        alignItems: "center",
        width: "358px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
        marginTop: "0",
      },
      208325: {
        color: "#3b3b3b",
        fontSize: "24px",
      },
      227285: {
        minHeight: "20px",
        display: "flex",
        marginTop: "100px",
        justifyContent: "space-evenly",
        paddingTop: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        flexWrap: "wrap",
      },
      258949: {
        minHeight: "20px",
        alignItems: "center",
        width: "358px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      272644: {
        minHeight: "20px",
        width: "303px",
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
      },
      310869: {
        minHeight: "20px",
        width: "63px",
        height: "65px",
        marginTop: "10px",
        marginLeft: "0",
        borderStyle: "dotted",
        borderWidth: "1px",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingLeft: "5px",
        background: "#E6B2BA",
      },
      319269: {
        width: "100%",
        height: "100%",
        minWidth: "350px",
        background: "white",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingBottom: "5px",
        paddingLeft: "5px",
      },
      348806: {
        minHeight: "20px",
      },
      352908: {
        minHeight: "20px",
        display: "flex",
        marginTop: "100px",
        justifyContent: "space-evenly",
        paddingTop: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        background: "#ffb3d9",
        flexWrap: "wrap",
      },
      356969: {
        color: "#3b3b3b",
        fontSize: "24px",
      },
      359031: {
        paddingLeft: "100px",
        paddingRight: "100px",
        marginBottom: "100px",
        fontSize: "12px",
        color: "#454545",
        marginTop: "10px",
      },
      373040: {
        fontSize: "12px",
      },
      374152: {
        minHeight: "20px",
        alignItems: "center",
        width: "358px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      405318: {
        minHeight: "20px",
        width: "121px",
        flexDirection: "column",
        gap: "20px",
        display: "flex",
      },
      412282: {
        color: "#4a4a4a",
      },
      441882: {
        width: "178px",
        height: "fit-content",
      },
      468371: {
        color: "#3b3b3b",
        fontSize: "24px",
      },
      487938: {
        color: "#3b3b3b",
      },
      519402: {
        minHeight: "20px",
        width: "121px",
        flexDirection: "column",
        gap: "20px",
        display: "flex",
      },
      576277: {
        fontSize: "2em",
        fontWeight: "bold",
        color: "#ff7300",
      },
      579774: {
        display: "flex",
        justifyContent: "center",
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontStyle: "italic",
        marginTop: "10px",
        fontVariant: "small-caps",
      },
      607585: {
        fontSize: "12px",
        paddingTop: "5px",
        paddingBottom: "5px",
        paddingRight: "5px",
        paddingLeft: "5px",
        display: "flex",
        justifyContent: "center",
        background: "#BDB395",
      },
      659389: {
        height: "19px",
        color: "#3b3b3b",
      },
      690009: {
        minHeight: "20px",
        display: "flex",
        marginTop: "100px",
        justifyContent: "space-evenly",
        paddingTop: "20px",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        alignItems: "center",
        marginBottom: "100px",
        flexWrap: "wrap",
      },
      712436: {
        fontSize: "2em",
        fontWeight: "bold",
        fontStyle: "italic",
        color: "#ff7300",
      },
      741342: {
        color: "#3b3b3b",
      },
      743391: {
        fontSize: "14px",
      },
      782343: {
        borderStyle: "dotted",
        borderWidth: "1px",
      },
      787484: {
        minHeight: "20px",
        width: "175px",
        height: "168px",
        borderStyle: "dotted",
        borderWidth: "1px",
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        marginTop: "10px",
        background: "#FAD0C4",
      },
      799522: {
        minHeight: "20px",
        display: "flex",
        alignItems: "center",
        gap: "50px",
        marginTop: "20px",
        marginBottom: "0",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
        flexWrap: "wrap",
      },
      799609: {
        minHeight: "20px",
        height: "96px",
        background: "violet",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      832427: {
        minHeight: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "20px",
      },
      850899: {
        fontSize: "12px",
        display: "flex",
        justifyContent: "center",
      },
      881404: {
        minHeight: "20px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: "5px",
        paddingBottom: "5px",
      },
      900318: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#4a4a4a",
        marginTop: "20px",
      },
      920177: {
        minHeight: "20px",
      },
      936385: {
        width: "100%",
        height: "100%",
        minWidth: "350px",
        background: "white",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingBottom: "5px",
        paddingLeft: "5px",
      },
      936675: {
        minHeight: "20px",
        height: "96px",
        background: "#8F87F1",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
      },
      945829: {},
      962312: {
        fontSize: "12px",
        display: "flex",
        justifyContent: "center",
        borderStyle: "dotted",
        borderWidth: "1px",
        background: "#C599B6",
      },
      968176: {
        minHeight: "20px",
        display: "flex",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingRight: "20px",
        paddingLeft: "20px",
        gap: "20px",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#FED2E2",
      },
      968581: {
        color: "blue",
        justifyContent: "flex-end",
        marginTop: "0",
        paddingTop: "0",
        paddingBottom: "0",
        paddingRight: "0",
        paddingLeft: "0",
        fontStyle: "italic",
        fontSize: "14px",
        height: "15px",
      },
    },
    dataMap: {
      3575: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      11706: {
        name: "Image",
        type: "Image",
        hyperlink: "",
        newTab: false,
        src: "https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA",
        alt: "image",
        content: null,
        unit: true,
      },
      24406: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      25382: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "any component",
        unit: true,
      },
      43105: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      59187: {
        name: "Paragraph",
        type: "Paragraph",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Divbucket is currently in the development phase, and I'm working hard to make it better every day! As this project continue to improve, you can expect new features, enhanced performance, and even more customization options to make website creation easier than ever.",
        unit: true,
      },
      77336: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "Hi, I'm",
        unit: true,
      },
      91049: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "💼 I'm currently looking for job opportunities. If you happen to know of any openings or have any connections who might help, I'd really appreciate.",
        unit: true,
      },
      91625: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Even any feedback or advice from your side would mean a lot ❤️.",
        unit: true,
      },
      117400: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      126765: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      140244: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      196229: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      208325: {
        name: "Paragraph",
        type: "Paragraph",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Go beyond basic designs and create complex, interactive components effortlessly—without any coding.",
        unit: true,
      },
      227285: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      258949: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      272644: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      310869: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      319269: {
        type: "root",
        name: "Need Your Help",
        unit: false,
        open: true,
      },
      348806: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      352908: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      356969: {
        name: "Paragraph",
        type: "Paragraph",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Drag-and-drop editor makes website building as simple as moving elements on a page.  You can effortlessly add, arrange, and customize text, images, layouts and more.",
        unit: true,
      },
      359031: {
        name: "Paragraph",
        type: "Paragraph",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Stay tuned for updates, and feel free to share your thoughts.",
        unit: true,
      },
      373040: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "SIDEBAR",
        unit: true,
      },
      374152: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      405318: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      412282: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "💌 The motivation behind this project was to showcase and test my skills. The past six months have been very challenging due to unemployment, so I decided to work on something I love.\nI completed my bachelor's degree in Computer Science in 2024 and have around eight months of full-time experience.",
        unit: true,
      },
      441882: {
        name: "Image",
        type: "Image",
        hyperlink: "",
        newTab: false,
        src: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        alt: "image",
        content: null,
        unit: true,
      },
      468371: {
        name: "Paragraph",
        type: "Paragraph",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Divbucket is an intuitive no-code website builder that empowers anyone to create professional websites without any technical expertise.",
        unit: true,
      },
      487938: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "to drag",
        unit: true,
      },
      519402: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      576277: {
        name: "Heading",
        type: "Heading",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "Priyanshu",
        unit: true,
      },
      579774: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content:
          "Create Stunning Websites Without Writing a Single Line of Code!",
        unit: true,
      },
      607585: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "FOOTER",
        unit: true,
      },
      659389: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "Click the",
        unit: true,
      },
      690009: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      712436: {
        name: "Heading",
        type: "Heading",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "DIV",
        unit: true,
      },
      741342: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "drag icon",
        unit: true,
      },
      743391: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "Bucket",
        unit: true,
      },
      782343: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      787484: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      799522: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      799609: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      832427: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      850899: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "CONTENT",
        unit: true,
      },
      881404: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      900318: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "• A Full Stack Developer",
        unit: true,
      },
      920177: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      936385: {
        type: "root",
        name: "Home",
        unit: false,
        open: true,
      },
      936675: {
        name: "Block",
        type: "Block",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      945829: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "Welcome here",
        unit: true,
      },
      962312: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "HEADER",
        unit: true,
      },
      968176: {
        name: "Row",
        type: "Row",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: null,
        unit: false,
      },
      968581: {
        name: "Text",
        type: "Text",
        hyperlink: "",
        newTab: false,
        src: "",
        alt: "",
        content: "📧 priyanshutiwari88064@gmail.com",
        unit: true,
      },
      tabs: {
        unit: false,
        type: "tabwrapper",
        name: "tabwrapper",
      },
    },
    bgContentRect: {
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    clipboard: {
      cut: null,
      copy: null,
    },
  },
  reducers: {
    addNode: (state, { payload }) => {
      if (state.dataMap[payload.parent].unit) return;
      state.tree[payload.parent].push(Number(payload.child));
      state.tree[payload.child] = state.tree[payload.child] || [];
    },
    addTemplate: (state, { payload }) => {
      state.tree = { ...state.tree, ...payload.tree };
      state.dataMap = { ...state.dataMap, ...payload.dataMap };
      state.styleMap = { ...state.styleMap, ...payload.styleMap };
    },
    deleteNode: (state, { payload }) => {
      state.activeNodeId = getParent(state.tree, "tabs", state.activeNodeId);
      const deleteWork = (id) => {
        state.tree[id].map((child) => deleteWork(child));
        delete state.dataMap[id];
        delete state.styleMap[id];
        const { [id]: ___, ...newTree } = state.tree;
        state.tree = newTree;
      };
      deleteWork(payload.id);
      treeSlice.caseReducers.deleteFromParent(state, { payload });
    },
    deleteFromParent: (state, { payload }) => {
      if (!payload.id) return;
      state.tree = Object.keys(state.tree).reduce((acc, key) => {
        acc[key] = state.tree[key].filter((_id) => _id !== Number(payload.id));
        return acc;
      }, {});
    },
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.id;
    },
    updateActiveTab: (state, { payload }) => {
      state.activeTab = payload.tab;
      state.activeNodeId = payload.tab;
      if (!state.dataMap[payload.tab].open)
        state.dataMap[payload.tab].open = true;
    },
    updateTabOpenStatus: (state, { payload }) => {
      state.dataMap[payload.tab].open = payload.open;
      if (payload.tab !== state.activeTab) return;
      state.activeTab =
        state.tree.tabs.filter((tab) => state.dataMap[tab].open)[0] || null;
      state.activeNodeId = state.activeTab;
    },
    updateStyleMap: (state, { payload }) => {
      state.styleMap[payload.id] = payload.style;
    },
    updateDataMap: (state, { payload }) => {
      state.dataMap[payload.id] = payload.data;
    },
    updateRootWidth: (state, { payload }) => {
      state.styleMap[state.activeTab].width = payload.width;
    },
    updateBgContentRect: (state, { payload }) => {
      state.bgContentRect = payload.bgContentRect;
    },
    updateClipboard: (state, { payload }) => {
      if (state.clipboard.cut) {
        treeSlice.caseReducers.deleteNode(state, {
          payload: { id: state.clipboard.cut },
        });
        state.clipboard.cut = null;
      }
      if (state.tree.tabs.includes(payload.cut || payload.copy)) return;
      state.clipboard = payload;
    },
    paste: (state) => {
      const parent = state.activeNodeId;
      if (state.dataMap[parent].unit) return;
      if (state.clipboard.cut) {
        treeSlice.caseReducers.addNode(state, {
          payload: { parent, child: state.clipboard.cut },
        });
        state.activeNodeId = state.clipboard.cut;
        state.clipboard.copy = state.clipboard.cut;
        state.clipboard.cut = null;
      } else if (state.clipboard.copy) {
        const newChild = createCopy(state.clipboard.copy, state);
        state.tree[parent].push(newChild);
        state.activeNodeId = newChild;
      }
    },
    duplicate: (state) => {
      if (state.tree.tabs.includes(state.activeNodeId)) return;
      const duplicate = createCopy(state.activeNodeId, state);
      treeSlice.caseReducers.splice(state, {
        payload: { referenceNode: state.activeNodeId, pos: 1, node: duplicate },
      });
      state.activeNodeId = duplicate;
    },
    revealParent: (state) => {
      state.activeNodeId = getParent(
        state.tree,
        state.activeTab,
        state.activeNodeId
      );
    },
    splice: (state, { payload }) => {
      if (state.tree.tabs.includes(Number(payload.referenceNode))) {
        state.tree[payload.referenceNode].splice(0, 0, Number(payload.node));
      } else {
        const parent =
          payload.parent ||
          getParent(state.tree, "tabs", Number(payload.referenceNode));
        const index = state.tree[parent].indexOf(Number(payload.referenceNode));
        state.tree[parent].splice(index + payload.pos, 0, Number(payload.node));
      }
    },
    moveItem: (state, { payload }) => {
      const { node, referenceNode, pos } = payload;
      if (payload.pos === -1 && state.dataMap[payload.referenceNode].unit)
        return;
      if (
        !state.tree.tabs.includes(referenceNode) &&
        isRelation({
          tree: state.tree,
          parent: Number(node),
          child: Number(referenceNode),
        })
      )
        return;
      treeSlice.caseReducers.deleteFromParent(state, { payload: { id: node } });
      if (pos === -1)
        treeSlice.caseReducers.addNode(state, {
          payload: { parent: referenceNode, child: node },
        });
      else
        treeSlice.caseReducers.splice(state, {
          payload: { ...payload },
        });
      state.activeNodeId = Number(node);
    },
    cut: (state) => {
      const cutNode = state.activeNodeId;
      const parent = getParent(state.tree, "tabs", cutNode);
      if (state.tree.tabs.includes(cutNode)) return;
      treeSlice.caseReducers.updateClipboard(state, {
        payload: { cut: cutNode, copy: null },
      });
      treeSlice.caseReducers.deleteFromParent(state, {
        payload: { id: cutNode },
      });
      state.activeNodeId = parent || state.activeTab;
    },
    copy: (state) => {
      if (state.tree.tabs.includes(state.activeNodeId)) return;
      treeSlice.caseReducers.updateClipboard(state, {
        payload: { copy: state.activeNodeId, cut: null },
      });
    },
  },
});

export const {
  updateActiveNode,
  updateHoverNode,
  addNode,
  updateStyleMap,
  updateDataMap,
  deleteNode,
  deleteFromParent,
  updateRootWidth,
  updateBgContentRect,
  updateClipboard,
  paste,
  duplicate,
  revealParent,
  splice,
  moveItem,
  addTemplate,
  updateActiveTab,
  updateTabOpenStatus,
  cut,
  copy,
} = treeSlice.actions;
export default treeSlice.reducer;
