import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';
import { useDispatch } from 'react-redux';
import { updateBgContentRect } from '../../store/reducers/treeReducer';
import { useEffect, useRef } from 'react';

export default () => {
    const dispatch = useDispatch();
    const bgRef = useRef(null);

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
            <div className={styles.bg} ref={bgRef}>
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}