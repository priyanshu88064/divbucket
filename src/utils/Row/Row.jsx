import Resizable from "../Resizable/Resizable";

export default ({ tree, renderTree }) => {
    return (
        <Resizable
            id={tree.id}
        >
            {tree.id} Row
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}