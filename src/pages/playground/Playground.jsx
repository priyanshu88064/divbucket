import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';
import { useDispatch } from 'react-redux';
import { updateBgContentRect } from '../../store/reducers/treeReducer';
import { useEffect, useRef } from 'react';
import { useDrag } from '../../utils/hooks/useDrag';

export default () => {
    const dispatch = useDispatch();
    const bgRef = useRef(null);
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragLeave } = useDrag({ styles });

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const { width, height, top, bottom, left, right } = entries[0].contentRect;
            dispatch(updateBgContentRect({ bgContentRect: { width, height, top, bottom, left, right } }));
        })
        if (bgRef && bgRef.current) observer.observe(bgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.playground}>
            <SideBar />
            <div
                ref={bgRef}
                className={styles.bg}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
            >
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}