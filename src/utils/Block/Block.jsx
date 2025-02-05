import Resizable from "../Resizable/Resizable";

export default ({ node,tree, renderTree }) => {
    return (
        <Resizable
            id={node}
        >
            {
                tree[node].map(node => renderTree(node))
            }
        </Resizable>
    );
}