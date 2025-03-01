import { useSelector } from "react-redux";
import Resizable from "../Resizable/Resizable";

export default ({ node }) => {

    const dataMap = useSelector(state => state.treeReducer.dataMap[node]);

    return (
        <Resizable
            id={node}
        >
            {dataMap.content}
        </Resizable>
    );
}