export function addNode(tree,parent) {
    if(parent === tree.id) {
        tree.childrens.push({id:Date.now(),childrens:[]});
        return tree;
    }
}