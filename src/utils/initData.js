export default function initData(type) {
  let data = {
    name: type,
    type,
    hyperlink: "",
    newTab: false,
    src: "",
    alt: "",
    content:null
  };

  data.unit = ["Image","Video","Text","Heading","Paragraph"].includes(data.type);

  switch (type) {
    case "Text":
      data.content = "Welcome here";
      break;
    case "Paragraph":
      data.content =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      break;
    case "Heading":
      data.content = "HEADING";
      break;
    case "Image":
      data.src = "http://localhost:5173/sample.jpg";
      data.alt = "image";
      break;
  }

  return data;
}
