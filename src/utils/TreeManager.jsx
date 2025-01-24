import { useSelector } from "react-redux";
import Block from "./Block/Block";
import Resizable from "./Resizable/Resizable";
import Row from "./Row/Row";
import Heading from "./Heading/Heading";
import Text from "./Text/Text";
import Paragraph from "./Paragraph/Paragraph";
import Image from "./Image/Image";
import Video from "./Video/Video";

export default ({ }) => {

  const { tree } = useSelector(state => state.treeReducer);

  const renderTree = (tree) => {

    let ele;

    switch (tree.type) {
      case "Block":
        ele = (
          <Block
            key={tree.id}
            tree={tree}
            renderTree={renderTree}
          />
        );
        break;
      case "Row":
        ele = (
          <Row
            key={tree.id}
            tree={tree}
            renderTree={renderTree}
          />
        );
        break;
      case "Heading":
        ele = (
          <Heading
            key={tree.id}
            tree={tree}
          />
        );
        break;
      case "Text":
        ele = (
          <Text
            key={tree.id}
            tree={tree}
          />
        );
        break;
      case "Paragraph":
        ele = (
          <Paragraph
            key={tree.id}
            tree={tree}
          />
        );
        break;
      case "Image":
        ele = (
          <Image
            key={tree.id}
            tree={tree}
          />
        );
        break;
      case "Video":
        ele = (
          <Video
            key={tree.id}
            tree={tree}
          />
        );
        break;
      default:
        ele = (
          <Resizable
            id={tree.id}
            key={tree.id}
          >
            {tree.id} resizable
            {
              tree.childrens.map(node => renderTree(node))
            }
          </Resizable>
        );
        break;
    }

    return ele;

  }

  return (<>{tree.map(tree => renderTree(tree))}</>);
}
