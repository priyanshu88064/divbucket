import { useDispatch, useSelector } from "react-redux";
import Resizable from "../Resizable/Resizable";
import { changeTab } from "../../store/reducers/focusReducer";
import type { RootState } from "../../store/store";

export default ({ node }: { node: number }) => {
  const content = useSelector(
    (state: RootState) => state.treeReducer.dataMap[node].content,
  );
  const dispatch = useDispatch();
  return (
    <Resizable id={node}>
      {/* <div
        data-id={node}
        onDoubleClick={(e) => {
          e.stopPropagation();
          dispatch(changeTab({ tab: "11" }));
        }}
      > */}
      {content}
      {/* </div> */}
    </Resizable>
  );
};
