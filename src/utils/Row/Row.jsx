import Resizable from "../Resizable/Resizable";
import styles from './row.module.css';

export default ({tree,handleNodeDrop,renderTree}) => {
    return (
        <Resizable
            id={tree.id}
            key={tree.id}
            className={styles.row}
            onDrop={(droppeId, type) => handleNodeDrop(tree.id, droppeId, type)}
        >
            {tree.id} row
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}