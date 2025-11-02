import Resizable from "../Resizable/Resizable";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default ({ node }: { node: number }) => {
  const src = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.src,
  );
  const autoPlay = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.autoPlay,
  );
  const muted = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.muted,
  );
  const controls = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.controls,
  );
  const loop = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].media?.loop,
  );

  return (
    <Resizable id={node}>
      <video
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        className="w-full h-full"
      />
    </Resizable>
  );
};
