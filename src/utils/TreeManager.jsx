import { shallowEqual, useSelector } from "react-redux";
import Block from "./Block/Block";
import Resizable from "./Resizable/Resizable";
import Row from "./Row/Row";
import Heading from "./Heading/Heading";
import Text from "./Text/Text";
import Paragraph from "./Paragraph/Paragraph";
import Image from "./Image/Image";
import Video from "./Video/Video";
import styles from "./Resizable/resizable.module.css";
import useShortcuts from "./hooks/useShortcuts";

export default () => {
  const activeTab = useSelector(state => state.treeReducer.activeTab);
  const tree = useSelector(state => state.treeReducer.tree);
  const dataMap = useSelector(state => Object.fromEntries(
    Object.entries(state.treeReducer.dataMap).map(([key, value]) => ([key, value.type]))
  ), shallowEqual);

  const renderTree = (node) => {

    let ele;

    switch (dataMap[node]) {
      case "Block":
        ele = (
          <Block
            key={node}
            node={node}
            tree={tree}
            renderTree={renderTree}
          />
        );
        break;
      case "Row":
        ele = (
          <Row
            key={node}
            node={node}
            tree={tree}
            renderTree={renderTree}
          />
        );
        break;
      case "Heading":
        ele = (
          <Heading
            key={node}
            node={node}
          />
        );
        break;
      case "Text":
        ele = (
          <Text
            key={node}
            node={node}
          />
        );
        break;
      case "Paragraph":
        ele = (
          <Paragraph
            key={node}
            node={node}
          />
        );
        break;
      case "Image":
        ele = (
          <Image
            key={node}
            node={node}
          />
        );
        break;
      case "Video":
        ele = (
          <Video
            key={node}
            node={node}
          />
        );
        break;
      default:
        ele = (
          <Resizable
            id={node}
            key={node}
          >
            {node} resizable
            {
              tree[node].map(node => renderTree(node))
            }
          </Resizable>
        );
        break;
    }

    return ele;

  }

  return (
    <>
      {
        activeTab ?
          <div className={styles.fixinfobar}>
            <Resizable id={activeTab}>
              {tree[activeTab].map(tree => renderTree(tree))}
            </Resizable>
          </div>:
          ""
      }
    </>
  );
}
