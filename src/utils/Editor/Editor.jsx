import { useEffect, useRef, useState } from 'react';
import styles from './editor.module.css';
import { TbMinusVertical } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { addNode, updateActiveNode, updateDataMap, updateStyleMap } from '../../store/reducers/treeReducer';
import initCSS from '../initCSS';
import TreeManager from '../TreeManager';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from '../../Components/ContextMenu/ContextMenu';
import { useDrag } from '../hooks/useDrag';

export default ({ e_width, e_height, stopScrollRef }) => {

    const id = "root";
    const [dim, setDim] = useState({ width: e_width, height: e_height });
    const isResizingRef = useRef(false);
    const virtualPos = useRef({ top: null, bottom: null, left: null, right: null });
    const dirRef = useRef();
    const divRef = useRef();
    const dispatch = useDispatch();
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const { handleDragOver, handleDrop } = useDrag({ id });

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
            case 1:
                setDim(prev => {
                    let newDim = { ...prev };
                    virtualPos.current.right = e.clientX;
                    newDim.width = (virtualPos.current.right - virtualPos.current.left) + "px";
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
    const handleMouseDown = (direction) => {
        isResizingRef.current = true;
        dirRef.current = direction;
        initVirtualPosition();
        stopScrollRef.current.style.overflow = "hidden";
        stopScrollRef.current.style.userSelect = "none";
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    const handleMouseUp = () => {
        isResizingRef.current = false;
        dirRef.current = null;
        stopScrollRef.current.style.overflow = "scroll";
        stopScrollRef.current.style.userSelect = "";
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    useEffect(() => {
        const child = Date.now();
        dispatch(updateDataMap({ id: child, data: { name: "Row", type: "Row" } }));
        dispatch(updateStyleMap({ id: child, style: initCSS("Row") }));
        dispatch(addNode({ parent: id, child }));
        dispatch(updateActiveNode({ id: child }));
    }, []);

    return (
        <>
            <div
                ref={divRef}
                className={styles.editor}
                style={{
                    width: dim.width,
                    minHeight: dim.height,
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setClicked(true);
                    setPoints({ x: e.pageX, y: e.pageY });
                }}
                onClick={() => {
                    dispatch(updateActiveNode({ id: null }))
                }}
            >
                <div onMouseDown={() => handleMouseDown(3)} className={`${styles.resizable} ${styles.left}`}><TbMinusVertical className={styles.lines} /></div>
                <div onMouseDown={() => handleMouseDown(1)} className={`${styles.resizable} ${styles.right}`}><TbMinusVertical className={styles.lines} /></div>
                {
                    clicked &&
                    <ContextMenu
                        id={id}
                        points={points}
                        setClicked={setClicked}
                    />
                }
                <TreeManager />
            </div>
        </>
    );
}