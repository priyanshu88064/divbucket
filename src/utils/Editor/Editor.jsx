import { useEffect } from 'react';
import styles from './editor.module.css';
import { useDispatch } from 'react-redux';
import { addNode, updateActiveNode, updateDataMap, updateStyleMap } from '../../store/reducers/treeReducer';
import initCSS from '../initCSS';
import { useContextMenu } from '../hooks/useContextMenu';
import ContextMenu from '../../Components/ContextMenu/ContextMenu';
import { useDrag } from '../hooks/useDrag';
import initData from '../initData';
import { useResizer } from '../hooks/useResizer';

export default ({ children }) => {

    const id = "root";
    const { dim, divRef, handleMouseDown } = useResizer({ id });
    const { clicked, setClicked, points, setPoints } = useContextMenu();
    const { handleDragOver, handleDrop } = useDrag({ id });
    const dispatch = useDispatch();

    useEffect(() => {
        const child = Date.now();
        dispatch(updateDataMap({ id: child, data: initData("Row") }));
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
                <div onMouseDown={e => handleMouseDown(e, 3)} className={`${styles.resizablebar} ${styles.left}`}><TbMinusVertical className={styles.lines} /></div>
                <div onMouseDown={e => handleMouseDown(e, 1)} className={`${styles.resizablebar} ${styles.right}`}><TbMinusVertical className={styles.lines} /></div>
                {
                    clicked &&
                    <ContextMenu
                        id={id}
                        points={points}
                        setClicked={setClicked}
                    />
                }
                {children}
            </div>
        </>
    );
}