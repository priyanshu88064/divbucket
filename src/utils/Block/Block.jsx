import Resizable from "../Resizable/Resizable";
import styles from "./block.module.css";

export default ({ tree, renderTree }) => {
    return (
        <Resizable
            id={tree.id}
        >
            {tree.id} div/BLOCK
            {
                tree.childrens.map(node => renderTree(node))
            }
        </Resizable>
    );
}