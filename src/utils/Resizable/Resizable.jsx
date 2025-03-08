import { useState } from 'react';
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

export default ({ id, children }) => {

    const dispatch = useDispatch();
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const dataMap = useSelector(state => state.treeReducer.dataMap[id]);
    const { handleDrop, handleDragOver, handleDragStart, handleDragEnter, handleDragLeave } = useDrag({ id });
    const { dim, divRef, handleMouseDown } = useResizer({ id });
    const { clicked, setClicked, points, setPoints } = useContextMenu();

    console.log("resizable", id)

    return (
        <div
            style={{
                position: styleMap.position,
                top: styleMap.top,
                bottom: styleMap.bottom,
                right: styleMap.right,
                left: styleMap.left,
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
                style={{ ...styleMap, ...dim }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                draggable
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
                    id === "root" &&
                    <>
                        <div onMouseDown={e => handleMouseDown(e, 3)} className={`${styles.resizablebar} ${styles.left}`}><TbMinusVertical className={styles.lines} /></div>
                        <div onMouseDown={e => handleMouseDown(e, 1)} className={`${styles.resizablebar} ${styles.right}`}><TbMinusVertical className={styles.lines} /></div>

                    </>
                }
                {
                    id === activeNodeId ?
                        <>
                            <div className={styles.infobar}>
                                <div style={{ cursor: 'text', fontSize: '13px' }}>{dataMap.name}</div>
                                <div
                                    style={{ borderRight: 'none' }}
                                    title='edit'
                                    onClick={() => dispatch(changeTab({ tab: "11" }))}
                                >
                                    <MdOutlineEdit size={15} />
                                </div>
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
    );
}