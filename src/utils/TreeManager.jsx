import Resizable from "./Resizable/Resizable";

export default ({ tree,handleNodeDrop }) => {
  const renderTree = (tree) => {
    return (
      <Resizable
        id={tree.id}
        key={tree.id}
        onDrop={(droppeId)=>handleNodeDrop(tree.id,droppeId)}
      >
        {
          tree.childrens.map(node=>renderTree(node))
        }
      </Resizable>
    );
  }

  return (<>{tree.map(tree=>renderTree(tree))}</>);
}
