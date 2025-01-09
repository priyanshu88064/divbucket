import { useRef, useState } from 'react';
import styles from './resizable.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveNode, updateTree } from '../../store/reducers/treeReducer';
import { addNode } from '../treeFunctions';

export default ({ id, children, className, style }) => {

    const [dim, setDim] = useState({ width: style.width, height: style.height });
    const isResizingRef = useRef(false);
    const virtualPos = useRef({ top: null, bottom: null, left: null, right: null });
    const dirRef = useRef();
    const divRef = useRef();
    const dispatch = useDispatch();
    const { tree, activeNodeId } = useSelector(state => state.treeReducer);

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

        switch (dirRef.current) {
            case 0:
                setDim(prev => {
                    let newDim = { ...prev };
                    virtualPos.current.top = e.clientY;
                    newDim.height = (virtualPos.current.bottom - virtualPos.current.top) + "px";
                    return newDim;
                });
                break;
            case 1:
                setDim(prev => {
                    let newDim = { ...prev };
                    virtualPos.current.right = e.clientX;
                    newDim.width = (virtualPos.current.right - virtualPos.current.left) + "px";
                    return newDim;
                });
                break;
            case 2:
                setDim(prev => {
                    let newDim = { ...prev };
                    virtualPos.current.bottom = e.clientY;
                    newDim.height = (virtualPos.current.bottom - virtualPos.current.top) + "px";
                    return newDim;
                });
                break;
            case 3:
                setDim(prev => {
                    let newDim = { ...prev };
                    virtualPos.current.left = e.clientX;
                    newDim.width = (virtualPos.current.right - virtualPos.current.left) + "px";
                    return newDim;
                });
                break;
        }

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
        dispatch(updateTree({ tree: addNode(tree, id, { id: Date.now(), childrens: [] }) }))
    }
    const handleDrag = (e) => {
        e.preventDefault();
    }
    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("data", id);
    }

    return (
        <>
            <div
                ref={divRef}
                className={`${styles.a}`}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                style={{
                    height: dim.height,
                    width: dim.width
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(updateActiveNode({ nodeId: id }))
                }}
            >
                {
                    id === activeNodeId ?
                        <>
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
                <div
                    draggable
                    onDragStart={handleDragStart}
                    style={{
                        ...style,
                    }}
                    className={`${className} ${styles.draggable}`}
                >
                    {children}
                </div>

            </div>
        </>
    );
}