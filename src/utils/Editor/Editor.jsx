import { useEffect, useRef, useState } from 'react';
import styles from './editor.module.css';
import { TbMinusVertical } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveNode, updateDataMap, updateStyleMap, updateTree } from '../../store/reducers/treeReducer';
import initCSS from '../initCSS';

export default ({ children, e_width, e_height, stopScrollRef }) => {

    const [dim, setDim] = useState({ width: null, height: null });
    const isResizingRef = useRef(false);
    const virtualPos = useRef({ top: null, bottom: null, left: null, right: null });
    const dirRef = useRef();
    const divRef = useRef();
    const dispatch = useDispatch();
    const { tree } = useSelector(state => state.treeReducer);

    useEffect(() => {
        setDim({ width: e_width, height: e_height });
    }, [e_width, e_height]);

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
    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newNode = { id: Date.now(), type: e.dataTransfer.getData("type"), childrens: [] };
        dispatch(updateDataMap({ id: newNode.id, data: { name: newNode.type } }));
        dispatch(updateStyleMap({ id: newNode.id, style: initCSS(newNode.type) }));
        dispatch(updateTree({ tree: [...tree, newNode] }));
    }

    useEffect(() => {
        const newNode = { id: Date.now(), type: "Row", childrens: [] };
        dispatch(updateDataMap({ id: newNode.id, data: { name: newNode.type } }));
        dispatch(updateStyleMap({ id: newNode.id, style: initCSS(newNode.type) }));
        dispatch(updateTree({ tree: [...tree, newNode] }));
        dispatch(updateActiveNode({ nodeId: newNode.id }));
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
            >
                <div onMouseDown={() => handleMouseDown(3)} className={`${styles.resizable} ${styles.left}`}><TbMinusVertical className={styles.lines} /></div>
                <div onMouseDown={() => handleMouseDown(1)} className={`${styles.resizable} ${styles.right}`}><TbMinusVertical className={styles.lines} /></div>
                {children}
            </div>
        </>
    );
}