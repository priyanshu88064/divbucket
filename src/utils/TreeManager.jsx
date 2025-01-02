import Block from "./Block/Block";
import Resizable from "./Resizable/Resizable";
import Row from "./Row/Row";

export default ({ tree, handleNodeDrop }) => {
  const renderTree = (tree) => {

    let ele;

    switch (tree.type) {
      case "BLOCK":
        ele = (
          <Block
            tree={tree}
            handleNodeDrop={handleNodeDrop}
            renderTree={renderTree}
          />
        );
        break;

      case "ROW":
        ele = (
          <Row
            tree={tree}
            handleNodeDrop={handleNodeDrop}
            renderTree={renderTree}
          />
        );
        break;

      default:
        ele = (
          <Resizable
            id={tree.id}
            key={tree.id}
            onDrop={(droppeId, type) => handleNodeDrop(tree.id, droppeId, type)}
          >
            {tree.id}
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
