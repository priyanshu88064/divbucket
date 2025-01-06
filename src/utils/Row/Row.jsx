import Resizable from "../Resizable/Resizable";
import styles from './row.module.css';

export default ({ tree, renderTree }) => {
    return (
        <Resizable
            id={tree.id}
            className={styles.row}
        >
            {tree.id} row
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}