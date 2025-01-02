import Resizable from "../Resizable/Resizable";
import styles from "./block.module.css";

export default ({tree,handleNodeDrop,renderTree}) => {
    return (
        <Resizable
            id={tree.id}
            key={tree.id}
            onDrop={(droppeId, type) => handleNodeDrop(tree.id, droppeId, type)}
        >
            {tree.id} block
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}