import styles from './resizable.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveNode } from '../../store/reducers/treeReducer';
import { useDrag } from '../hooks/useDrag';
import { useResizer } from '../hooks/useResizer';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from '../../Components/ContextMenu/ContextMenu';
import { changeTab } from '../../store/reducers/focusReducer';
import { MdOutlineEdit } from 'react-icons/md';
import { TbMinusVertical } from 'react-icons/tb';
import { GetIconOfType } from '../../Components/Cssbar/Cssbar';
import { RiDragMove2Fill } from 'react-icons/ri';

export default ({ id, children }) => {

    const dispatch = useDispatch();
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const name = useSelector(state => state.treeReducer.dataMap[id].name);
    const type = useSelector(state => state.treeReducer.dataMap[id].type);
    const unit = useSelector(state => state.treeReducer.dataMap[id].unit);
    const { dim, divRef, handleMouseDown } = useResizer({ id });
    const { clicked, setClicked, points, setPoints } = useContextMenu();

    return (
        <div className={`${styles.awrap} ${type === "root" && styles.root}`}>
            {
                clicked &&
                <ContextMenu
                    id={id}
                    points={points}
                    setClicked={setClicked}
                />
            }
            <div
                ref={divRef}
                data-root={id}
                className={`${styles.a}`}
                style={{ ...styleMap, ...dim }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (id !== activeNodeId)
                        dispatch(updateActiveNode({ id }))
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setClicked(true);
                    setPoints({ x: e.pageX, y: e.pageY });
                    dispatch(updateActiveNode({ id }))
                }}
            >
                {
                    id === activeNodeId ?
                        <>
                            <InfoBar name={name} type={type} id={id} />
                            {
                                type !== "root" &&
                                <>
                                    <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 0)} className={`${styles.resizable} ${styles.top}`}></div>
                                    <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 1)} className={`${styles.resizable} ${styles.right}`}></div>
                                    <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 2)} className={`${styles.resizable} ${styles.bottom}`}></div>
                                    <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 3)} className={`${styles.resizable} ${styles.left}`}></div>
                                    <div onMouseDown={(e) => handleMouseDown(e, 0)} className={`${styles.circle} ${styles.ctop}`}></div>
                                    <div onMouseDown={(e) => handleMouseDown(e, 1)} className={`${styles.circle} ${styles.cright}`}></div>
                                    <div onMouseDown={(e) => handleMouseDown(e, 2)} className={`${styles.circle} ${styles.cbottom}`}></div>
                                    <div onMouseDown={(e) => handleMouseDown(e, 3)} className={`${styles.circle} ${styles.cleft}`}></div>
                                </>
                            }
                        </> :
                        type !== "root" &&
                        <div
                            data-target={id}
                            className={`${styles.hov} ${unit && styles.unit}`}
                        ></div>
                }
                {children}
            </div>
            {type === "root" && <div onMouseDown={e => handleMouseDown(e, 1)} className={`${styles.resizablebar} ${styles.rightbar}`}><TbMinusVertical className={styles.lines} /></div>}
        </div >
    );
}

const InfoBar = ({ name, type, id }) => {
    const dispatch = useDispatch();
    return (
        <div className={`${styles.infobar}`}>
            <div className={styles.ib0}>
                {GetIconOfType(type, 12)}
                {name}
            </div>
            <div
                style={{ cursor: 'pointer' }}
                title='edit'
                onClick={() => dispatch(changeTab({ tab: "11" }))}
            >
                <MdOutlineEdit size={12} />
            </div>
            {type !== 'root' && <div
                draggable
                data-id={id}
                style={{ borderRight: 'none', cursor: 'grab' }}
            >
                <RiDragMove2Fill size={14} />
            </div>}
        </div>
    );
}