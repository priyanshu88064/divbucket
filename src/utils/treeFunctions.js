export function addNode(tree,parent,node) {
    return tree.map(n=>{
        if(n.id === parent){
            return {...n,childrens:[...n.childrens,node]}
        }
        return {...n,childrens:addNode(n.childrens,parent,node)}
    })
}