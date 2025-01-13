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
    gap:"0px"
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
