import type { NodeData, NodeStyle, Tree, TreeState } from "../types/Tree";
import type { WritableDraft } from "immer";

const cssMap = [
  ["width", "width"],
  ["min-width", "minWidth"],
  ["max-width", "maxWidth"],
  ["height", "height"],
  ["max-height", "maxHeight"],
  ["min-height", "minHeight"],
  ["display", "display"],
  ["flex-direction", "flexDirection"],
  ["justify-content", "justifyContent"],
  ["align-items", "alignItems"],
  ["gap", "gap"],
  ["flex-wrap", "flexWrap"],
  ["margin-top", "marginTop"],
  ["margin-right", "marginRight"],
  ["margin-bottom", "marginBottom"],
  ["margin-left", "marginLeft"],
  ["padding-top", "paddingTop"],
  ["padding-right", "paddingRight"],
  ["padding-bottom", "paddingBottom"],
  ["padding-left", "paddingLeft"],
  ["font-weight", "fontWeight"],
  ["font-size", "fontSize"],
  ["background", "background"],
  ["font-family", "fontFamily"],
  ["font-style", "fontStyle"],
  ["text-decoration", "textDecoration"],
  ["font-variant", "fontVariant"],
  ["border-width", "borderWidth"],
  ["border-style", "borderStyle"],
  ["border-color", "borderColor"],
  ["color", "color"],
];

export function generateCode({
  tab,
  tree,
  dataMap,
  styleMap,
}: {
  tab: number;
  tree: Tree;
  dataMap: NodeData;
  styleMap: NodeStyle;
}) {
  let cind = 0;
  let css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

`;

  const work = (id: number, spacing: string) => {
    cind++;
    let html = "";
    css += `${
      dataMap[id].type === "root" ? "body" : "." + dataMap[id].name + "_" + cind
    }{\n`;
    cssMap.map(([x, y]) => {
      if (dataMap[id].type !== "root" || (y !== "width" && y !== "minWidth"))
        css += styleMap[id][y] ? "  " + x + ": " + styleMap[id][y] + `;\n` : "";
    });
    css += `}\n`;

    if (dataMap[id].type === "root") {
      html = `${spacing}<body>${tree[id].length ? "\n\n" : ""}`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</body>\n`;
    } else if (dataMap[id].type === "Block") {
      html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>${
        tree[id].length ? "\n\n" : ""
      }`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</div>\n`;
    } else if (dataMap[id].type === "Row") {
      html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>${
        tree[id].length ? "\n\n" : ""
      }`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</div>\n`;
    } else if (dataMap[id].type === "Heading") {
      html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Text") {
      html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Paragraph") {
      html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Image") {
      html = `${spacing}<img class='${dataMap[id].name + "_" + cind}' alt='${
        dataMap[id].alt
      }' src='${dataMap[id].src}' />\n`;
    } else if (dataMap[id].type === "Video") {
    }

    return html;
  };

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>${dataMap[tab].name}</title>
</head>
`;
  html += work(tab, "");
  html += `</html>`;

  return { html, css };
}

export const getParent = (tree: Tree, start: number, id: number): number => {
  if (tree[start].includes(id)) return start;
  for (const node of tree[start]) {
    const result = getParent(tree, node, id);
    if (result) return result;
  }
  throw new Error("cannot get parent [getParent]");
};

export const DeleteFromParent = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      id: number | string;
    };
  },
) => {
  if (!payload.id) return;
  state.tree = Object.keys(state.tree).reduce((acc: Tree, key) => {
    acc[Number(key)] = state.tree[Number(key)].filter(
      (_id) => _id !== Number(payload.id),
    );
    return acc;
  }, {});
};

export const DeleteNode = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      id: number;
    };
  },
) => {
  if (!state.activeNodeId) return;
  state.activeNodeId = getParent(state.tree, -1, state.activeNodeId);
  if (!state.activeNodeId) return;

  state.activeNodeId = getParent(state.tree, -1, state.activeNodeId);
  const deleteWork = (id: number) => {
    state.tree[id].map((child) => deleteWork(child));
    delete state.dataMap[id];
    delete state.styleMap[id];
    const { [id]: ___, ...newTree } = state.tree;
    state.tree = newTree;
  };
  deleteWork(payload.id);
  DeleteFromParent(state, { payload });
};

export const AddNode = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      parent: number;
      child: number;
    };
  },
) => {
  if (state.dataMap[payload.parent].unit) return;
  state.tree[payload.parent].push(Number(payload.child));
  state.tree[payload.child] = state.tree[payload.child] || [];
};

export const Splice = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      referenceNode: number;
      pos: number;
      node: number;
      parent?: number;
    };
  },
) => {
  if (state.tree[-1].includes(Number(payload.referenceNode))) {
    state.tree[payload.referenceNode].splice(0, 0, Number(payload.node));
  } else {
    const parent =
      payload.parent ||
      getParent(state.tree, -1, Number(payload.referenceNode));
    const index = state.tree[parent].indexOf(Number(payload.referenceNode));
    state.tree[parent].splice(index + payload.pos, 0, Number(payload.node));
  }
};
