import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveTab, updateBgContentRect } from '../../store/reducers/treeReducer';
import { useEffect, useRef } from 'react';
import { useDrag } from '../../utils/hooks/useDrag';
import { IoIosClose } from 'react-icons/io';

export default () => {
    const dispatch = useDispatch();
    const bgRef = useRef(null);
    const tabs = useSelector(state => state.treeReducer.tree.tabs);
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragLeave } = useDrag({ root: activeTab });

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
                <div className={styles.tabwrap}>
                    {
                        tabs.map((tab, ind) => (
                            <div
                                key={tab + ind + ""}
                                onClick={() => dispatch(updateActiveTab({ tab }))}
                                className={`${styles.tab} ${tab === activeTab && styles.activetab}`}
                            >
                                {tab}
                                <IoIosClose style={{ cursor: "pointer" }} size={17} />
                            </div>
                        ))
                    }
                </div>
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}