import { FaImage } from "react-icons/fa";
import Resizable from "../Resizable/Resizable";
import styles from "./image.module.css";

export default ({ key }) => {
    return (
        <Resizable
            id={key}
        >
            <div className={styles.image}>
                <FaImage size={40} color="gray"/>
            </div>
        </Resizable>
    );
}