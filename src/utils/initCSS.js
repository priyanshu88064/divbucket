export default function initCSS(type) {
  let style = {
    width: "auto",
    minWidth: "0px",
    maxWidth:"none",
    height: "auto",
    minHeight:"0px",
    maxHeight:"none",
    display: "block",
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"stretch",
    gap:"0px",
    flexWrap:"nowrap",
    marginTop:"0",
    marginRight:"0",
    marginBottom:"0",
    marginLeft:"0",
    paddingTop:"0",
    paddingRight:"0",
    paddingBottom:"0",
    paddingLeft:"0",
    position:'static',
    top:'auto',
    bottom:"auto",
    right:"auto",
    left:"auto"
  };

  switch (type) {
    case "ROW":
      style.height = "50px";
      style.display = "flex";
      break;
    case "BLOCK":
      style.height = "20px";
      break;
  }

  return style;
}
