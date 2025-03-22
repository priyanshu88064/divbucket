export default function initCSS(type) {
  let style = {
    width: "auto",
    minWidth: "0px",
    maxWidth: "none",
    height: "auto",
    minHeight: "0px",
    maxHeight: "none",
    display: "block",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: "0px",
    flexWrap: "nowrap",
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
    paddingLeft: "0",
    fontWeight: "normal",
    fontSize: "16px",
    background:"transparent",
    fontFamily:"system-ui",
    fontStyle:"normal",
    textDecoration:"none",
    fontVariant:"normal",
    borderWidth:"1px",
    borderStyle:"none",
    borderColor:"#000000",
    color:"#000000",
    position: "static",
    top: "auto",
    bottom: "auto",
    right: "auto",
    left: "auto",
  };

  switch (type) {
    case "Row":
      style.height = "50px";
      style.display = "flex";
      break;
    case "Block":
      style.height = "20px";
      break;
    case "Heading":
      style.fontSize = "2em";
      style.fontWeight = "bold";
      break;
    case "Text":
      style.width = "fit-content";
      break;
    case "Video":
      style.width = "200px";
      style.height = "200px";
      break;
  }

  return style;
}
