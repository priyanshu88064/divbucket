import styles from './playground.module.css';
import SideBar from '../../Components/SideBar/SideBar';
import Cssbar from '../../Components/Cssbar/Cssbar';
import TreeManager from '../../utils/TreeManager';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateActiveTab, updateBgContentRect, updateTabOpenStatus } from '../../store/reducers/treeReducer';
import { useEffect, useRef } from 'react';
import { useDrag } from '../../utils/hooks/useDrag';
import { IoIosClose } from 'react-icons/io';
import { createSelector } from '@reduxjs/toolkit';
import useShortcuts from '../../utils/hooks/useShortcuts';

export default () => {
    const dispatch = useDispatch();
    const bgRef = useRef(null);
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragLeave } = useDrag({ root: activeTab });
    useShortcuts();

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const { width, height, top, bottom, left, right } = entries[0].contentRect;
            dispatch(updateBgContentRect({ bgContentRect: { width, height, top, bottom, left, right } }));
        })
        if (bgRef && bgRef.current) observer.observe(bgRef.current);

        return () => {
            observer.disconnect();
        }
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
                <Tabs />
                <TreeManager />
            </div>
            <Cssbar />
        </div>
    );

}

const selectTabsOpen = createSelector(
    (state) => state.treeReducer.dataMap,
    (dataMap) => Object.fromEntries(
        Object.entries(dataMap)
            .filter(data => data[1].type === 'root')
            .map(([key, value]) => ([key, value.open]))
    ),
);
const selectTabsName = createSelector(
    (state) => state.treeReducer.dataMap,
    (dataMap) => Object.fromEntries(
        Object.entries(dataMap)
            .filter(data => data[1].type === 'root')
            .map(([key, value]) => ([key, value.name]))
    ),
);

const Tabs = () => {
    const tabs = useSelector(state => state.treeReducer.tree.tabs, shallowEqual);
    const activeTab = useSelector(state => state.treeReducer.activeTab);
    const tabsOpen = useSelector(selectTabsOpen, shallowEqual)
    const tabsName = useSelector(selectTabsName, shallowEqual);
    const dispatch = useDispatch();

    return (
        <div className={styles.tabwrap}>
            {
                tabs.filter(tab => tabsOpen[tab])
                    .map((tab, ind) => (
                        <div
                            key={tab + ind + ""}
                            onClick={() => dispatch(updateActiveTab({ tab }))}
                            className={`${styles.tab} ${tab === activeTab && styles.activetab}`}
                        >
                            {tabsName[tab]}
                            <IoIosClose style={{ cursor: "pointer" }} onClick={e => {
                                e.stopPropagation();
                                dispatch(updateTabOpenStatus({ tab, open: false }))
                            }} size={17} />
                        </div>
                    ))
            }
        </div>
    );
}