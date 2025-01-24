import { useRef, useState } from 'react';
import styles from './resizable.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveNode, updateDataMap, updateStyleMap, updateTree } from '../../store/reducers/treeReducer';
import { addNode } from '../treeFunctions';
import initCSS from '../initCSS';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { MdDelete, MdOutlineMoreHoriz } from 'react-icons/md';

export default ({ id, children }) => {

    const isResizingRef = useRef(false);
    const virtualPos = useRef({ top: null, bottom: null, left: null, right: null });
    const dirRef = useRef();
    const divRef = useRef();
    const dispatch = useDispatch();
    const { tree, activeNodeId, styleMap, dataMap } = useSelector(state => state.treeReducer);
    const [isLock, setIsLock] = useState(false);

    const initVirtualPosition = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            virtualPos.current = {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            }
        }
    }

    const handleMouseMove = (e) => {
        if (!isResizingRef.current || !divRef.current) return;
        let newDim = { ...styleMap[id] };
        switch (dirRef.current) {
            case 0:
                virtualPos.current.top = e.clientY;
                newDim.height = Math.floor(virtualPos.current.bottom - virtualPos.current.top) + "px";
                break;
            case 1:
                virtualPos.current.right = e.clientX;
                newDim.width = Math.floor(virtualPos.current.right - virtualPos.current.left) + "px";
                break;
            case 2:
                virtualPos.current.bottom = e.clientY;
                newDim.height = Math.floor(virtualPos.current.bottom - virtualPos.current.top) + "px";
                break;
            case 3:
                virtualPos.current.left = e.clientX;
                newDim.width = Math.floor(virtualPos.current.right - virtualPos.current.left) + "px";
                break;
        }
        dispatch(updateStyleMap({ id, style: newDim }));
    }
    const handleMouseDown = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        isResizingRef.current = true;
        dirRef.current = direction;
        initVirtualPosition();
        divRef.current.style.userSelect = "none";
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    const handleMouseUp = () => {
        divRef.current.style.userSelect = "";
        isResizingRef.current = false;
        dirRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedId = e.dataTransfer.getData("data");

        if (id == droppedId) return;
        const newNode = { id: Date.now(), childrens: [] };
        dispatch(updateDataMap({ id: newNode.id, data: { name: "Changethis" } }));
        dispatch(updateStyleMap({ id: newNode.id, style: initCSS(newNode.type) }));
        dispatch(updateTree({ tree: addNode(tree, id, newNode) }))
    }
    const handleDrag = (e) => {
        e.preventDefault();
    }
    const handleDragStart = (e) => {
        e.stopPropagation();
        var img = document.createElement("img");
        img.src = "";
        e.dataTransfer.setDragImage(img, 0, 0);
        e.dataTransfer.setData("data", id);
    }

    return (
        <>
            <div style={{
                position: styleMap[id].position,
                top: styleMap[id].top,
                bottom: styleMap[id].bottom,
                right: styleMap[id].right,
                left: styleMap[id].left,
            }}>
                <div
                    ref={divRef}
                    className={styles.a}
                    onDrop={handleDrop}
                    onDragOver={handleDrag}
                    style={styleMap[id]}
                    draggable
                    onDragStart={handleDragStart}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(updateActiveNode({ nodeId: id }))
                    }}
                >
                    {
                        id === activeNodeId ?
                            <>
                                <div className={styles.infobar}>
                                    <div style={{ cursor: 'text', fontSize: '13px' }}>{dataMap[id].name}</div>
                                    {
                                        isLock ?
                                            <div onClick={() => setIsLock(false)}><FaLock size={14} /></div> :
                                            <div onClick={() => setIsLock(true)}><FaUnlock size={14} color='rgba(255, 255, 255, 0.71)' /></div>

                                    }
                                    <div ><MdDelete size={17} /></div>
                                    <div style={{ borderRight: 'none', fontSize: '16px' }}><MdOutlineMoreHoriz /></div>
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