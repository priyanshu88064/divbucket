import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

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

  ["background", "background"],
  ["background-color", "backgroundColor"],
  ["background-image", "backgroundImage"],
  ["background-repeat", "backgroundRepeat"],
  ["background-position", "backgroundPosition"],
  ["background-size", "backgroundSize"],

  ["color", "color"],
  ["font-weight", "fontWeight"],
  ["font-size", "fontSize"],
  ["font-family", "fontFamily"],
  ["font-style", "fontStyle"],
  ["text-decoration", "textDecoration"],
  ["text-transform", "textTransform"],
  ["text-align", "textAlign"],
  ["font-variant", "fontVariant"],

  ["border-width", "borderWidth"],
  ["border-top-width", "borderTopWidth"],
  ["border-bottom-width", "borderBottomWidth"],
  ["border-left-width", "borderLeftWidth"],
  ["border-right-width", "borderRightWidth"],
  ["border-style", "borderStyle"],
  ["border-color", "borderColor"],
  ["border-radius", "borderRadius"],

  ["overflow-x", "overflowX"],
  ["overflow-y", "overflowY"],

  ["box-shadow", "boxShadow"],
  ["text-shadow", "textShadow"],

  ["translate", "translate"],

  ["cursor", "cursor"],
];

export function useGenerateCode() {
  const tree = useSelector((state: RootState) => state.treeReducer.tree);
  const dataMap = useSelector((state: RootState) => state.treeReducer.dataMap);
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap,
  );

  const generate = ({
    tab,
    isInternalStyleSheet,
  }: {
    tab: number;
    isInternalStyleSheet: boolean;
  }) => {
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
        dataMap[id].type === "root"
          ? "body"
          : "." + dataMap[id].name + "_" + cind
      }{\n`;
      cssMap.map(([x, y]) => {
        if (dataMap[id].type !== "root" || (y !== "width" && y !== "minWidth"))
          css += (styleMap as any)[id][y]
            ? "  " + x + ": " + (styleMap as any)[id][y] + `;\n`
            : "";
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

    let html = work(tab, "");
    html += `</html>`;

    html =
      `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>${dataMap[tab].name}</title>
        ${
          isInternalStyleSheet
            ? `<style>
            ${css}
        </style>`
            : ""
        }
</head>
` + html;

    return { html, css };
  };

  return { generate };
}
