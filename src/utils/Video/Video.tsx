import { FaVideo } from "react-icons/fa";
import Resizable from "../Resizable/Resizable";
import styles from "./video.module.css";

export default ({ node }: { node: number }) => {
  return (
    <Resizable id={node}>
      <div className={styles.video}>
        <FaVideo size={40} color="gray" />
      </div>
    </Resizable>
  );
};
