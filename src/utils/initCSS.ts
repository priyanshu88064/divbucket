import type { CSSProperties } from "react";

export default function initCSS(type: string) {
  let style: CSSProperties = {};

  switch (type) {
    case "Row":
      style.minHeight = "20px";
      style.display = "flex";
      break;
    case "Block":
      style.minHeight = "20px";
      break;
    case "Heading":
      style.fontSize = "2em";
      style.fontWeight = "bold";
      break;
    case "Image":
      style.width = "fit-content";
      style.height = "fit-content";
      break;
    case "Video":
      style.width = "200px";
      style.height = "200px";
      break;
  }

  return style;
}
