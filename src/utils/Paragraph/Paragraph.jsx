import { useDispatch, useSelector } from "react-redux";
import Resizable from "../Resizable/Resizable";
import { changeTab } from "../../store/reducers/focusReducer";

export default ({ node }) => {
    const content = useSelector(state => state.treeReducer.dataMap[node].content);
    const dispatch = useDispatch();

    return (
        <Resizable
            id={node}
        >
            <div onDoubleClick={e => {
                e.stopPropagation();
                dispatch(changeTab({ tab: "11" }))
            }}>{content}</div>
        </Resizable>
    );
}