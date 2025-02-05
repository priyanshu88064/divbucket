// export function addNode(tree, parent, node) {
//   if (tree.id === parent)
//     return { ...tree, childrens: [...tree.childrens, node] };
//   else
//     return {
//       ...tree,
//       childrens: tree.childrens.map((n) => addNode(n, parent, node)),
//     };
// }

// export function GetNodeById(tree, id) {
//   for (node of tree) {
//     if (node.id === id) return node;
//     let child = GetNodeById(node.childrens, id);
//     if (child) return child;
//   }
//   return null;
// }

// export function DeleteNode(tree, id) {
//   if (tree.id === id) return null;
//   return {
//     ...tree,
//     childrens: tree.childrens.map((n) => DeleteNode(n, id)).filter(Boolean),
//   };
// }

// export function DragNode(tree,parentId,nodeId){
//   DeleteNode(tree,nodeId);
//   AddNode(tree,nodeId);
// }
