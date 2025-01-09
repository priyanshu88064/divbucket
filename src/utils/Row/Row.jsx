import Resizable from "../Resizable/Resizable";
import styles from './row.module.css';

export default ({ tree, renderTree }) => {
    return (
        <Resizable
            id={tree.id}
            style={tree.style}
        >
            {tree.id} h-flex/row
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}