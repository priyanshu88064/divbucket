import type { NodeData } from "../types/Tree";

export default function initData(type: string) {
  let data: NodeData[number] = {
    name: type,
    type,
    hyperlink: "",
    content: null,
  };

  data.unit = [
    "Image",
    "Video",
    "Text",
    "Heading",
    "Paragraph",
    "Button",
  ].includes(data.type);

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
      data.media = {
        src: "/sample.jpg",
        alt: "image",
      };
      break;
    case "Video":
      data.media = {
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        loop: true,
        muted: true,
        autoPlay: true,
        controls: false,
      };
      break;
    case "Button":
      data.content = "Button";
      break;
  }

  return data;
}
