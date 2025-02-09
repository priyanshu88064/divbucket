import { useState } from 'react';
import styles from './resizable.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveNode } from '../../store/reducers/treeReducer';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useDrag } from '../hooks/useDrag';
import { useResizer } from '../hooks/useResizer';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from '../../Components/ContextMenu/ContextMenu';

export default ({ id, children }) => {

    const dispatch = useDispatch();
    const { activeNodeId, styleMap, dataMap } = useSelector(state => state.treeReducer);
    const { handleDrop, handleDragOver, handleDragStart, handleDragEnter, handleDragLeave } = useDrag({ id });
    const { dim, divRef, handleMouseDown } = useResizer({ id });
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const [isLock, setIsLock] = useState(false);

    return (
        <>
            <div
                style={{
                    position: styleMap[id].position,
                    top: styleMap[id].top,
                    bottom: styleMap[id].bottom,
                    right: styleMap[id].right,
                    left: styleMap[id].left,
                }}
            >
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
                    className={styles.a}
                    style={{ ...styleMap[id], ...dim }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    draggable
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(updateActiveNode({ nodeId: id }))
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setClicked(true);
                        setPoints({ x: e.pageX, y: e.pageY });
                    }}
                >
                    {
                        id === activeNodeId ?
                            <>
                                <div className={styles.infobar}>
                                    <div style={{ cursor: 'text', fontSize: '13px' }}>{dataMap[id].name}</div>
                                    {
                                        isLock ?
                                            <div style={{ borderRight: 'none' }} onClick={() => setIsLock(false)}><FaLock size={12} /></div> :
                                            <div style={{ borderRight: 'none' }} onClick={() => setIsLock(true)}><FaUnlock size={12} color='rgba(255, 255, 255, 0.71)' /></div>
                                    }
                                </div>
                                <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 0)} className={`${styles.resizable} ${styles.top}`}></div>
                                <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 1)} className={`${styles.resizable} ${styles.right}`}></div>
                                <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 2)} className={`${styles.resizable} ${styles.bottom}`}></div>
                                <div draggable={false} onMouseDown={(e) => handleMouseDown(e, 3)} className={`${styles.resizable} ${styles.left}`}></div>
                                <div onMouseDown={(e) => handleMouseDown(e, 0)} className={`${styles.circle} ${styles.ctop}`}></div>
                                <div onMouseDown={(e) => handleMouseDown(e, 1)} className={`${styles.circle} ${styles.cright}`}></div>
                                <div onMouseDown={(e) => handleMouseDown(e, 2)} className={`${styles.circle} ${styles.cbottom}`}></div>
                                <div onMouseDown={(e) => handleMouseDown(e, 3)} className={`${styles.circle} ${styles.cleft}`}></div>
                            </> :
                            <div className={`${styles.resizable} ${styles.hov}`}></div>
                    }
                    {children}
                </div>
            </div>

        </>
    );
}