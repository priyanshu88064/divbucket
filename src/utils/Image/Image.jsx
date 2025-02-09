import { FaImage } from "react-icons/fa";
import Resizable from "../Resizable/Resizable";
import styles from "./image.module.css";

export default ({ node }) => {
    return (
        <Resizable
            id={node}
        >
            <div className={styles.image}>
                <FaImage size={40} color="gray"/>
            </div>
        </Resizable>
    );
}