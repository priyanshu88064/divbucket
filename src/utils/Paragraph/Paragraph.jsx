import { useSelector } from "react-redux";
import Resizable from "../Resizable/Resizable";
import styles from "../Resizable/resizable.module.css";
import { MdOutlineEdit } from "react-icons/md";

export default ({ node }) => {

    const dataMap = useSelector(state => state.treeReducer.dataMap[node]);

    return (
        <Resizable
            id={node}
            InfoBar={
                <div className={styles.infobar}>
                    <div style={{ cursor: 'text', fontSize: '13px' }}>{dataMap.name}</div>
                    <div
                        style={{ borderRight: 'none' }}
                        title='edit'
                    >
                        <MdOutlineEdit size={15} />
                    </div>
                </div>
            }
        >
            {dataMap.content}
        </Resizable>
    );
}