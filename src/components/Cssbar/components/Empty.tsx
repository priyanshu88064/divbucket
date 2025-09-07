import { FaCat } from "react-icons/fa";
import styles from "../cssbar.module.css";

export default function Empty() {
  return (
    <div className={styles.empty}>
      <FaCat size={50} />
      <div>Feeling empty</div>
    </div>
  );
}
