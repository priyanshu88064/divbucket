import { useSelector } from "react-redux";
import Block from "./Block/Block";
import Resizable from "./Resizable/Resizable";
import Row from "./Row/Row";

export default ({}) => {

  const { tree } = useSelector(state => state.treeReducer);

  const renderTree = (tree) => {

    let ele;

    switch (tree.type) {
      case "BLOCK":
        ele = (
          <Block
            key={tree.id}
            tree={tree}
            renderTree={renderTree}
          />
        );
        break;

      case "ROW":
        ele = (
          <Row
            key={tree.id}
            tree={tree}
            renderTree={renderTree}
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
