import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { CssState } from "../types/Tree";

const STR_CSS_INIT = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

`;

// mapping of stylesheet naming to js naming
const cssMap: { [key: string]: string } = {
  width: "width",
  minWidth: "min-width",
  maxWidth: "max-width",
  height: "height",
  maxHeight: "max-height",
  minHeight: "min-height",

  display: "display",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  alignItems: "align-items",
  gap: "gap",
  flexWrap: "flex-wrap",

  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",

  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",

  background: "background",
  backgroundColor: "background-color",
  backgroundImage: "background-image",
  backgroundRepeat: "background-repeat",
  backgroundPosition: "background-position",
  backgroundSize: "background-size",

  color: "color",
  fontWeight: "font-weight",
  fontSize: "font-size",
  fontFamily: "font-family",
  fontStyle: "font-style",
  textDecoration: "text-decoration",
  textTransform: "text-transform",
  textAlign: "text-align",
  fontVariant: "font-variant",

  borderWidth: "border-width",
  borderTopWidth: "border-top-width",
  borderBottomWidth: "border-bottom-width",
  borderLeftWidth: "border-left-width",
  borderRightWidth: "border-right-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderRadius: "border-radius",

  overflowX: "overflow-x",
  overflowY: "overflow-y",

  boxShadow: "box-shadow",
  textShadow: "text-shadow",

  translate: "translate",

  cursor: "cursor",
};

export function useGenerateCode() {
  const tree = useSelector((state: RootState) => state.treeReducer.tree);
  const dataMap = useSelector((state: RootState) => state.treeReducer.dataMap);
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap,
  );

  function createDeclaration(
    id: number,
    selector: string,
    pseudoClass: CssState,
  ) {
    let declaration = `.${selector}${pseudoClass !== "default" ? ":" + pseudoClass : ""} {\n`;

    Object.keys(styleMap[id][pseudoClass]).map((prop) => {
      if (
        dataMap[id].type !== "root" ||
        (prop !== "width" && prop !== "minWidth")
      )
        declaration += `  ${cssMap[prop]}: ${(styleMap[id][pseudoClass] as any)[prop]};\n`;
    });

    declaration += "}\n";
    return declaration;
  }

  const generate = ({
    tab,
    isInternalStyleSheet,
  }: {
    tab: number;
    isInternalStyleSheet: boolean;
  }) => {
    let cind = 0;
    let css = STR_CSS_INIT;

    const work = (id: number, spacing: string) => {
      cind++;
      let html = "";

      ["default", "hover", "active"].map((cssState) => {
        if (Object.keys(styleMap[id][cssState as CssState]).length === 0)
          return;
        if (cssState === "default" && dataMap[id].type === "root")
          css += createDeclaration(id, "body", "default");
        else
          css += createDeclaration(
            id,
            `${dataMap[id].name}_${cind}`,
            cssState as CssState,
          );
      });

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
      } else if (dataMap[id].type === "Button") {
        html = `${spacing}<div class='${dataMap[id].name + "_" + cind}'>`;
        html += `${dataMap[id].content}`;
        html += `</div>\n`;
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
