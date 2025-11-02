import type { RootState } from "../../store/store";
import Resizable from "../Resizable/Resizable";
import styles from "./image.module.css";
import { useSelector } from "react-redux";

export default ({ node }: { node: number }) => {
  const src = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.src,
  );
  const alt = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.alt,
  );

  return (
    <Resizable id={node}>
      <img data-id={node} src={src} alt={alt} className={styles.image} />
    </Resizable>
  );
};
