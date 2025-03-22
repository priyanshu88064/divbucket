/*
{
    tree: {
      '57960': [],
      '240914': [],
      '405382': [],
      '518524': [
        562890,
        535670
      ],
      '535670': [],
      '562890': [],
      '691121': [],
      '968001': [
        518524
      ],
      tabs: [
        'root',
        57960
      ],
      root: [
        968001,
        691121,
        240914,
        405382
      ]
    }
}
*/
export function generateCode({ tab, tree, dataMap, styleMap }) {
  let cind = 0;
  let css = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

`;

  const work = (id, spacing) => {
    cind++;
    let html = "";
    css += `${dataMap[id].type === "root" ? "body" : "." + dataMap[id].name+'_'+cind} {
    width: ${styleMap[id].width};
    min-width: ${styleMap[id].minWidth};
    max-width: ${styleMap[id].maxWidth};
    height: ${styleMap[id].height};
    min-height: ${styleMap[id].minHeight};
    max-height: ${styleMap[id].maxHeight};
    display: ${styleMap[id].display};
    flex-direction: ${styleMap[id].flexDirection};
    justify-content: ${styleMap[id].justifyContent};
    align-items: ${styleMap[id].alignItems};
    gap: ${styleMap[id].gap};
    flex-wrap: ${styleMap[id].flexWrap};
    margin-top: ${styleMap[id].marginTop};
    margin-right: ${styleMap[id].marginRight};
    margin-bottom: ${styleMap[id].marginBottom};
    margin-left: ${styleMap[id].marginLeft};
    padding-top: ${styleMap[id].paddingTop};
    padding-right: ${styleMap[id].paddingRight};
    padding-bottom: ${styleMap[id].paddingBottom};
    padding-left: ${styleMap[id].paddingLeft};
    font-weight: ${styleMap[id].fontWeight};
    font-size: ${styleMap[id].fontSize};
    background: ${styleMap[id].background};
    font-family: ${styleMap[id].fontFamily};
    font-style: ${styleMap[id].fontStyle};
    text-decoration: ${styleMap[id].textDecoration};
    font-variant: ${styleMap[id].fontVariant};
    border-width: ${styleMap[id].borderWidth};
    border-style: ${styleMap[id].borderStyle};
    border-color: ${styleMap[id].borderColor};
    color: ${styleMap[id].color};
}

`
;

    if (dataMap[id].type === "root") {
      html = `${spacing}<body>${tree[id].length ? "\n\n" : ""}`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</body>\n`;
    } else if (dataMap[id].type === "Block") {
      html = `${spacing}<div class='${dataMap[id].name+'_'+cind}'>${tree[id].length ? "\n\n" : ""}`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</div>\n`;
    } else if (dataMap[id].type === "Row") {
      html = `${spacing}<div class='${dataMap[id].name+'_'+cind}'>${tree[id].length ? "\n\n" : ""}`;
      tree[id].map((tab) => {
        html += work(tab, spacing + "         ");
      });
      html += `${tree[id].length ? `\n${spacing}` : ""}</div>\n`;
    } else if (dataMap[id].type === "Heading") {
      html = `${spacing}<div class='${dataMap[id].name+'_'+cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Text") {
      html = `${spacing}<div class='${dataMap[id].name+'_'+cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Paragraph") {
      html = `${spacing}<div class='${dataMap[id].name+'_'+cind}'>`;
      html += `${dataMap[id].content}`;
      html += `</div>\n`;
    } else if (dataMap[id].type === "Image") {
      html = `${spacing}<img class='${dataMap[id].name+'_'+cind}' alt='${dataMap[id].alt}' src='${dataMap[id].src}' />\n`;
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
