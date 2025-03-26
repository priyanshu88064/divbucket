import Resizable from "../Resizable/Resizable";
import styles from "./image.module.css";
import { useSelector } from "react-redux";

export default ({ node }) => {

    const src = useSelector(state => state.treeReducer.dataMap[node].src);
    const alt = useSelector(state => state.treeReducer.dataMap[node].alt);

    return (
        <Resizable
            id={node}
        >
            <img src={src} alt={alt} className={styles.image} />
        </Resizable>
    );
}