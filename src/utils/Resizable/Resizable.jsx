import { useRef, useState } from 'react';
import styles from './resizable.module.css';

export default ({ children, className, c_width, c_height, onDrop }) => {

    const [dim, setDim] = useState({ width: c_width || '100px', height: c_height || '100px' });
    const isResizingRef = useRef(false);
    const virtualPos = useRef({ top: null, bottom: null, left: null, right: null });
    const dirRef = useRef();
    const divRef = useRef();

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
    const handleMouseDown = (direction) => {
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
        onDrop(e.dataTransfer.getData("data"));
    }
    const handleDrag = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div
                ref={divRef}
                className={`${className} ${styles.a}`}
                style={{
                    height: dim.height,
                    width: dim.width
                }}
                onDrop={handleDrop}
                onDragOver={handleDrag}
            >
                <div draggable={false} onMouseDown={() => handleMouseDown(0)} className={`${styles.resizable} ${styles.top}`}></div>
                <div draggable={false} onMouseDown={() => handleMouseDown(1)} className={`${styles.resizable} ${styles.right}`}></div>
                <div draggable={false} onMouseDown={() => handleMouseDown(2)} className={`${styles.resizable} ${styles.bottom}`}></div>
                <div draggable={false} onMouseDown={() => handleMouseDown(3)} className={`${styles.resizable} ${styles.left}`}></div>
                <div onMouseDown={() => handleMouseDown(0)} className={`${styles.circle} ${styles.ctop}`}></div>
                <div onMouseDown={() => handleMouseDown(1)} className={`${styles.circle} ${styles.cright}`}></div>
                <div onMouseDown={() => handleMouseDown(2)} className={`${styles.circle} ${styles.cbottom}`}></div>
                <div onMouseDown={() => handleMouseDown(3)} className={`${styles.circle} ${styles.cleft}`}></div>
                <div
                    draggable
                    className={styles.draggable}
                >
                    {children}
                </div>

            </div>
        </>
    );
}