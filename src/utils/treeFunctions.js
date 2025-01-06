export function addNode(tree, parent, node) {
  return tree.map((n) => {
    if (n.id === parent) {
      return { ...n, childrens: [...n.childrens, node] };
    }
    return { ...n, childrens: addNode(n.childrens, parent, node) };
  });
}

export function GetNodeById(tree, id) {
  for (node of tree) {
    if (node.id === id) return node;
    let child = GetNodeById(node.childrens, id);
    if (child) return child;
  }
  return null;
}