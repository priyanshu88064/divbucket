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
import { FaHome, FaImage, FaRegSquare, FaSquare, FaVideo } from 'react-icons/fa';
import { LuHeading1 } from 'react-icons/lu';
import { IoText } from 'react-icons/io5';
import { BsTextParagraph } from 'react-icons/bs';

export default ({ id, children }) => {

    const dispatch = useDispatch();
    const activeNodeId = useSelector(state => state.treeReducer.activeNodeId);
    const styleMap = useSelector(state => state.treeReducer.styleMap[id]);
    const name = useSelector(state => state.treeReducer.dataMap[id].name);
    const type = useSelector(state => state.treeReducer.dataMap[id].type);
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
                        <div onMouseDown={e => handleMouseDown(e, 3)} className={`${styles.resizablebar} ${styles.leftbar}`}><TbMinusVertical className={styles.lines} /></div>
                        <div onMouseDown={e => handleMouseDown(e, 1)} className={`${styles.resizablebar} ${styles.rightbar}`}><TbMinusVertical className={styles.lines} /></div>

                    </>
                }
                {
                    id === activeNodeId ?
                        <>
                            <InfoBar name={name} type={type} />
                            {
                                id !== "root" &&
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
                        id !== "root" && <div className={`${styles.resizable} ${styles.hov}`}></div>
                }
                {children}
            </div>
        </div >
    );
}

const InfoBar = ({ name, type }) => {
    const dispatch = useDispatch();
    return (
        <div className={styles.infobar}>
            <div className={styles.ib0}>
                {
                    type === "root" ?
                        <FaHome size={12} /> :
                        type === "Block" ?
                            <FaRegSquare size={12} /> :
                            type === "Row" ?
                                <FaRegSquare size={12} /> :
                                type === "Heading" ?
                                    <LuHeading1 size={12} /> :
                                    type === "Text" ?
                                        <IoText size={12} /> :
                                        type === "Paragraph" ?
                                            <BsTextParagraph size={12} /> :
                                            type === "Image" ?
                                                <FaImage size={12} /> :
                                                type === "Video" && <FaVideo size={12} />
                }
                {name}
            </div>
            <div
                style={{ borderRight: 'none', cursor: 'pointer' }}
                title='edit'
                onClick={() => dispatch(changeTab({ tab: "11" }))}
            >
                <MdOutlineEdit size={15} />
            </div>
        </div>
    );
}