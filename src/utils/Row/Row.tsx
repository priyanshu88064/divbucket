import type { Tree } from "../../types/Tree";
import Resizable from "../Resizable/Resizable";

export default ({
  node,
  tree,
  renderTree,
}: {
  node: number;
  tree: Tree;
  renderTree: (node: number) => React.JSX.Element;
}) => {
  return (
    <Resizable id={node}>
      {tree[node].map((node) => renderTree(node))}
    </Resizable>
  );
};
